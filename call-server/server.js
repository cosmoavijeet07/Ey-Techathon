import Fastify from "fastify";
import WebSocket from "ws";
import dotenv from "dotenv";
import fastifyFormbody from "@fastify/formbody";
import fastifyWs from "@fastify/websocket";
import Twilio from "twilio";
import cors from "@fastify/cors";

// Load environment variables
dotenv.config();

// Twilio configuration
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER } = process.env;
const twilioClient = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Initialize Fastify server
const fastify = Fastify();

// Enable CORS
fastify.register(cors, {
  origin: ["http://localhost:3000", "https://kiwi-worthy-lightly.ngrok-free.app"], // Allow both local and Ngrok origins
  methods: ["GET", "POST", "PUT", "DELETE"],
});

fastify.register(fastifyFormbody);
fastify.register(fastifyWs);

// Store active calls and their associated WebSocket connections
const activeCalls = new Map();
const clientConnections = new Map();

// WebSocket for real-time communication
fastify.register(async (fastify) => {
  fastify.get("/media-stream", { websocket: true }, (connection, req) => {
    console.log("Client connected to media-stream");

    let callSid = req.headers["x-twilio-call-sid"] || `session_${Date.now()}`;
    const clientId = req.headers["x-client-id"] || `client_${Date.now()}`;
    
    // Store connections for routing
    if (callSid.startsWith("CA")) {
      // This is a Twilio connection for a specific call
      activeCalls.set(callSid, connection);
    } else {
      // This is a browser client connection
      clientConnections.set(clientId, connection);
    }

    // Handle incoming messages
    connection.on("message", (message) => {
      try {
        const data = JSON.parse(message);

        if (data.event === "media") {
          // Forward Twilio audio to the browser client
          clientConnections.forEach((clientConn) => {
            if (clientConn.readyState === WebSocket.OPEN) {
              clientConn.send(JSON.stringify({ 
                event: "media", 
                payload: data.media.payload,
                callSid: callSid
              }));
            }
          });
        } else if (data.event === "client-media") {
          // Forward browser client audio to Twilio
          const targetCallSid = data.media.callSid;
          const twilioConn = activeCalls.get(targetCallSid);
          
          if (twilioConn && twilioConn.readyState === WebSocket.OPEN) {
            twilioConn.send(JSON.stringify({
              event: "media",
              streamSid: targetCallSid,
              media: {
                payload: data.media.payload
              }
            }));
          }
        } else if (data.event === "call-received") {
          // Call received by the client - notify all browser clients
          clientConnections.forEach((clientConn) => {
            if (clientConn.readyState === WebSocket.OPEN) {
              clientConn.send(JSON.stringify({ 
                event: "call-received",
                callSid: callSid
              }));
            }
          });
        } else if (data.event === "stop") {
          // Call ended - notify all browser clients
          clientConnections.forEach((clientConn) => {
            if (clientConn.readyState === WebSocket.OPEN) {
              clientConn.send(JSON.stringify({ 
                event: "call-ended",
                callSid: callSid
              }));
            }
          });
          
          // Clean up the Twilio connection
          activeCalls.delete(callSid);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    });

    // Handle WebSocket close
    connection.on("close", () => {
      console.log("WebSocket connection closed");
      
      // Clean up connections
      activeCalls.delete(callSid);
      clientConnections.delete(clientId);
      
      // Notify other clients if a call connection was closed
      if (callSid.startsWith("CA")) {
        clientConnections.forEach((clientConn) => {
          if (clientConn.readyState === WebSocket.OPEN) {
            clientConn.send(JSON.stringify({ 
              event: "call-ended",
              callSid: callSid
            }));
          }
        });
      }
    });
  });
});

// Endpoint to initiate outgoing call
fastify.post("/initiate-call", async (request, reply) => {
  const { to } = request.body;

  try {
    const call = await twilioClient.calls.create({
      url: `https://kiwi-worthy-lightly.ngrok-free.app/call-handler`, // TwiML URL for call handling
      to: to,
      from: TWILIO_NUMBER,
      statusCallback: "https://kiwi-worthy-lightly.ngrok-free.app/call-status", // Add status callback
      statusCallbackEvent: ["initiated", "ringing", "answered", "completed"], // Track all status events
      statusCallbackMethod: "POST"
    });

    reply.send({ message: "Call initiated", callSid: call.sid });
  } catch (error) {
    console.error("Error initiating call:", error);
    reply.status(500).send({ error: "Failed to initiate call" });
  }
});

// Call status callback endpoint
fastify.post("/call-status", (request, reply) => {
  const { CallSid, CallStatus } = request.body;
  console.log(`Call ${CallSid} status: ${CallStatus}`);
  
  // Notify all clients about call status changes
  if (CallStatus === "in-progress") {
    clientConnections.forEach((clientConn) => {
      if (clientConn.readyState === WebSocket.OPEN) {
        clientConn.send(JSON.stringify({ 
          event: "call-received",
          callSid: CallSid
        }));
      }
    });
  } else if (CallStatus === "completed" || CallStatus === "failed" || CallStatus === "busy" || CallStatus === "no-answer") {
    clientConnections.forEach((clientConn) => {
      if (clientConn.readyState === WebSocket.OPEN) {
        clientConn.send(JSON.stringify({ 
          event: "call-ended",
          callSid: CallSid
        }));
      }
    });
  }
  
  reply.send({ received: true });
});

// Add this new endpoint to your server.js file to enable call status checking
// Place this with your other endpoints

// Endpoint to check call status
fastify.get("/call-status-check", async (request, reply) => {
    const { callSid } = request.query;
    
    if (!callSid) {
      return reply.status(400).send({ error: "Call SID is required" });
    }
    
    try {
      // Fetch call status from Twilio
      const call = await twilioClient.calls(callSid).fetch();
      
      // Return the status
      reply.send({ 
        status: call.status,
        duration: call.duration,
        direction: call.direction,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error checking call status:", error);
      reply.status(500).send({ error: "Failed to check call status" });
    }
  });

// Endpoint to end an active call
fastify.post("/end-call", async (request, reply) => {
  const { callSid } = request.body;

  try {
    await twilioClient.calls(callSid).update({ status: "completed" });
    
    // Notify all clients that the call has ended
    clientConnections.forEach((clientConn) => {
      if (clientConn.readyState === WebSocket.OPEN) {
        clientConn.send(JSON.stringify({ 
          event: "call-ended",
          callSid: callSid
        }));
      }
    });
    
    reply.send({ message: "Call ended" });
  } catch (error) {
    console.error("Error ending call:", error);
    reply.status(500).send({ error: "Failed to end call" });
  }
});

// TwiML endpoint for call handling
fastify.post("/call-handler", (request, reply) => {
  const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
                        <Response>
                            <Say>Connection established. Starting two way communication.</Say>
                            <Connect>
                                <Stream url="wss://kiwi-worthy-lightly.ngrok-free.app/media-stream" />
                            </Connect>
                            <Say>The call has ended. Goodbye.</Say>
                        </Response>`;

  reply.type("text/xml").send(twimlResponse);
});

// Start the server
const PORT = process.env.PORT || 80;
fastify.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is listening on port ${PORT}`);
});