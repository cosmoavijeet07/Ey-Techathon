import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { login } from "../authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { roles } = await login(email, password);

      if (roles.includes("admin")) {
        navigate("/admin/dashboard");
      } else if (roles.includes("manager")) {
        navigate("/manager_dashboard");
      } else if (roles.includes("agent")) {
        navigate("/call-queue");
      } else {
        navigate("/clientdashboard");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 min-h-screen font-sans flex items-center justify-center">
      {/* Login Container */}
      <motion.div
        className="bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl p-12 w-full max-w-lg" // Increased max-width and padding
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-6">OptiClaim </h2> {/* Larger font size */}
        <p className="text-gray-600 text-center mb-8 text-lg">Log in to access your account</p> {/* Larger font size */}

        {/* Error Message */}
        {error && (
          <motion.div
            className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 text-center" // Increased padding
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-8"> {/* Increased spacing */}
          <div className="space-y-6"> {/* Increased spacing */}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-lg font-medium text-gray-700 mb-3"> {/* Larger font size */}
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg" // Larger padding and font size
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-lg font-medium text-gray-700 mb-3"> {/* Larger font size */}
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg" // Larger padding and font size
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <center>
          <button
            type="submit"
            className="w-half px-8 py-4  text-white bg-blue-600 hover:bg-blue-500 transition-all font-semibold shadow-md text-lg" // Larger padding and font size
          >
            Login
          </button>
          </center>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-8 text-center"> {/* Increased margin-top */}
          <a href="#" className="text-blue-600 hover:text-blue-500 text-lg"> {/* Larger font size */}
            Forgot your password?
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;