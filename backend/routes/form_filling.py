from flask import Flask, Blueprint, request, jsonify
from dotenv import load_dotenv
from pathlib import Path
from langchain_community.vectorstores import FAISS
from langchain.indexes.vectorstore import VectorStoreIndexWrapper
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
import google.generativeai as genai
from PyPDF2 import PdfReader
import os
import re
import io
from langchain.llms.base import LLM
from typing import Any, List, Optional, Dict
from pydantic import Field, BaseModel

GOOGLE_API_KEY="AIzaSyAZCfPg4CG778dEtoWW4BwDICXjven5u-k"

# Custom Gemini LLM class - unchanged from the original
class GeminiLLM(LLM, BaseModel):
    model_name: str = Field(default="gemini-1.5-flash", description="Gemini Model Name")
    model: Optional[Any] = Field(None, description="Gemini Model Instance")

    def __init__(self, model_name: str, **data):
        super().__init__(model_name=model_name, **data)
        self.model = genai.GenerativeModel(model_name=self.model_name)

    def _call(self, transcript: str, stop: Optional[List[str]] = None) -> str:
        system_prompt = """
        You are an AI assistant designed to extract structured information from call transcripts. 
        Analyze the transcript and return the following details in a **readable text format**:

        - Customer Name: (Full name of the customer, or "Unknown" if not mentioned)
        - Customer Age: (Age of the customer, or "Unknown" if not mentioned)
        - Sentiment: (Overall sentiment of the customer - "Positive", "Negative", or "Neutral")
        - Issue Summary: (Brief summary of the customer's issue)
        - Call Duration: (Approximate duration of the call in minutes, if available)
        - Agent Name: (The name of the support agent, if mentioned)

        Ensure the response is formatted as **plain text** (no JSON).
        """

        full_prompt = f"{system_prompt}\n\nCall Transcript:\n{transcript}\n\nExtracted Info:"
        response = self.model.generate_content(full_prompt)
        return response.text

    @property
    def _llm_type(self) -> str:
        return "gemini"

    @property
    def _identifying_params(self) -> Dict[str, Any]:
        return {"model_name": self.model_name}

# Function to extract text from uploaded files - adapted for Flask
def extract_text(file_content, file_type):
    if file_type == "application/pdf":
        pdf_reader = PdfReader(io.BytesIO(file_content))
        text = ''.join([page.extract_text() or '' for page in pdf_reader.pages])
    elif file_type == "text/plain":
        text = file_content.decode("utf-8")
    else:
        return None
    return text

# Function to extract structured details using regex - unchanged
def extract_details_with_regex(response_text):
    extracted_info = {
        "name": "Unknown",
        "age": "Unknown",
        "sentiment": "Unknown",
        "issue_summary": "Unknown",
        "call_duration": "Unknown",
        "agent_name": "Unknown"
    }

    patterns = {
        "name": r"Customer Name:\s*(.*)",
        "age": r"Customer Age:\s*(\d+)",
        "sentiment": r"Sentiment:\s*(Positive|Negative|Neutral)",
        "issue_summary": r"Issue Summary:\s*(.*)",
        "call_duration": r"Call Duration:\s*(\d+)\s*minutes?",
        "agent_name": r"Agent Name:\s*(.*)"
    }

    for key, pattern in patterns.items():
        match = re.search(pattern, response_text, re.IGNORECASE)
        if match:
            extracted_info[key] = match.group(1).strip()

    return extracted_info

# Function to process transcript - adapted for Flask
def process_transcript(text):
    if not text:
        return None, None

    gemini_llm = GeminiLLM(model_name='gemini-1.5-flash')
    response_text = gemini_llm._call(text)
    
    extracted_info = extract_details_with_regex(response_text)

    genai.configure(api_key=GOOGLE_API_KEY)

    embedding_function = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
    faiss_vector_store = FAISS.from_texts([text], embedding_function)

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=200)
    texts = text_splitter.split_text(text)
    faiss_vector_store.add_texts(texts[:50])

    faiss_vector_index = VectorStoreIndexWrapper(vectorstore=faiss_vector_store)
    
    return extracted_info, faiss_vector_index

# Create Flask Blueprint
form_filling_bp= Blueprint('form_filling', __name__)

# In-memory store for the vector indices (in production, use a proper database)
transcript_data = {}

@form_filling_bp.route('/upload', methods=['POST'])
def upload_transcript():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # Get file content and type
    file_content = file.read()
    file_type = file.content_type
    
    # Extract text from file
    text = extract_text(file_content, file_type)
    if not text:
        return jsonify({"error": "Unsupported file format. Please upload a PDF or TXT file"}), 400
    
    # Process transcript
    extracted_info, faiss_vector_index = process_transcript(text)
    
    # Generate a unique ID for this transcript
    import uuid
    transcript_id = str(uuid.uuid4())
    
    # Store in memory (in production, use a database)
    transcript_data[transcript_id] = {
        "text": text,
        "extracted_info": extracted_info,
        "faiss_vector_index": faiss_vector_index
    }
    
    return jsonify({
        "message": "Transcript processed successfully",
        "transcript_id": transcript_id,
        "extracted_info": extracted_info
    })

@form_filling_bp.route('/form/<transcript_id>', methods=['GET'])
def get_form_data(transcript_id):
    if transcript_id not in transcript_data:
        return jsonify({"error": "Transcript not found"}), 404
    
    return jsonify(transcript_data[transcript_id]["extracted_info"])

@form_filling_bp.route('/form/<transcript_id>', methods=['PUT'])
def update_form_data(transcript_id):
    if transcript_id not in transcript_data:
        return jsonify({"error": "Transcript not found"}), 404
    
    data = request.json
    transcript_data[transcript_id]["extracted_info"].update(data)
    
    return jsonify({
        "message": "Form updated successfully",
        "updated_data": transcript_data[transcript_id]["extracted_info"]
    })

@form_filling_bp.route('/query/<transcript_id>', methods=['POST'])
def query_transcript(transcript_id):
    if transcript_id not in transcript_data:
        return jsonify({"error": "Transcript not found"}), 404
    
    query_text = request.json.get('query')
    if not query_text:
        return jsonify({"error": "No query provided"}), 400
    
    gemini_llm = GeminiLLM(model_name='gemini-1.5-flash')
    faiss_vector_index = transcript_data[transcript_id]["faiss_vector_index"]
    
    answer = faiss_vector_index.query(query_text, llm=gemini_llm).strip()
    
    return jsonify({
        "query": query_text,
        "answer": answer
    })