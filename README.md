# Document-Based AI Chatbot (RAG POC)

This is a full-stack proof of concept for a Retrieval-Augmented Generation (RAG) chatbot using Node.js, React, OpenAI, and Qdrant.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Frontend:** React (Vite), CSS
- **AI:** OpenAI (Embeddings: `text-embedding-3-large`, LLM: `gpt-4o`)
- **Vector DB:** Qdrant (Docker)

## Prerequisites
- [Docker](https://www.docker.com/) installed
- [Node.js](https://nodejs.org/) (v16+)
- OpenAI API Key

## Setup Instructions

### 1. Run Qdrant with Docker
Run the following command to start Qdrant locally:
```bash
docker run -p 6333:6333 -p 6334:6334 -v qdrant_storage:/qdrant/storage qdrant/qdrant
```

### 2. Backend Setup
1. Navigate to `backend/`
2. Run `npm install`
3. Edit `.env` and add your `OPENAI_API_KEY`
4. Add your PDF files to the `backend/docs/` folder.
5. Start the server:
```bash
node server.js
```

### 3. Frontend Setup
1. Navigate to `frontend/`
2. Run `npm install`
3. Start the Vite dev server:
```bash
npm run dev
```

### 4. How to Use
1. Once both servers are running, open the frontend (usually `http://localhost:5173`).
2. Click **"Sync Documents"** at the top right. This will process the PDFs in `backend/docs/`, generate embeddings, and store them in Qdrant.
3. Once ingestion is complete, start chatting!

## Features
- **No Hallucination:** Answers strictly based on document context.
- **Large Document Support:** Chunks documents for efficient processing.
- **Modern UI:** Clean, premium chat interface with loading states.
- **Fast Retrieval:** Uses Qdrant's vector search for relevant context.
