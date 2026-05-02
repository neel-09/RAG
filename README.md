---
title: QuantumAI
emoji: ⚛️
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
app_port: 7860
---

# QuantumAI — RAG Pipeline with Groq LLM
 
A Retrieval-Augmented Generation (RAG) pipeline built with LangChain and Groq, specialized as **QuantumAI** — an AI assistant dedicated exclusively to quantum mechanics and quantum entanglement topics. Features a FastAPI backend, a React frontend with a cutting-edge dark UI, and full Docker + cloud deployment support.
 
---
 
## 🧠 What It Does
 
This project implements a complete RAG system that:
 
1. Loads a domain-specific knowledge base (quantum entanglement text)
2. Splits and embeds the documents into a Chroma vector store
3. Retrieves the top-K most relevant chunks for a given query
4. Feeds the retrieved context + query into a Groq-hosted LLM via a FastAPI backend
5. Returns a grounded, in-scope answer through an interactive React chat UI
---
 
## 🗂️ Project Structure
 
```
RAG/
├── .env                          # API keys (never commit this)
├── quantum_entanglement.txt      # Knowledge base document
├── rag_implementation.ipynb      # Jupyter notebook (RAG experiments)
├── main.py                       # FastAPI backend server
├── requirements.txt              # Python dependencies
├── Dockerfile                    # Multi-stage Docker build
├── docker-compose.yml            # Local container orchestration
├── .dockerignore                 # Docker build exclusions
├── README.md
└── frontend/                     # React frontend
    ├── package.json
    ├── .env                      # REACT_APP_API_URL for dev proxy
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css             # Design tokens & global styles
        ├── App.js                # Root component, state, API calls
        ├── App.css
        └── components/
            ├── ParticleCanvas.js # Animated multi-color particle background
            ├── Sidebar.js        # Nav + configuration panel
            ├── Sidebar.css
            ├── Header.js         # Top bar with live status
            ├── Header.css
            ├── ChatArea.js       # Message list + welcome screen
            ├── ChatArea.css
            ├── Message.js        # Individual message + source chunks
            ├── Message.css
            ├── InputBar.js       # Textarea + model/temp/chunk controls
            └── InputBar.css
```
 
---
 
## ⚙️ Tech Stack
 
| Component        | Tool / Library                          |
|------------------|-----------------------------------------|
| LLM              | Groq (`llama-3.1-8b-instant`, `llama-3.3-70b-versatile`, `mixtral-8x7b-32768`) |
| RAG Framework    | LangChain                               |
| Embeddings       | HuggingFace Sentence Transformers (`all-MiniLM-L6-v2`) |
| Vector Store     | Chroma                                  |
| Backend API      | FastAPI + Uvicorn                       |
| Frontend         | React 18 (multi-component, CSS modules) |
| Containerization | Docker (multi-stage) + Docker Compose   |
| Deployment       | HuggingFace Spaces (Docker SDK)         |
| Environment Mgmt | `python-dotenv`                         |
 
---
 
## 🚀 Running Locally
 
### Option A — Docker (recommended)
 
```bash
# Build and start everything
docker compose up --build
 
# Visit
http://localhost:8000
```
 
### Option B — Dev mode (hot reload)
 
```bash
# Terminal 1 — backend
uvicorn main:app --reload --port 8000
 
# Terminal 2 — frontend
cd frontend
npm install
npm start     # opens http://localhost:3000, proxies API to :8000
```
 
### Option C — Production build served by FastAPI
 
```bash
cd frontend && npm install && npm run build
cd ..
uvicorn main:app --host 0.0.0.0 --port 8000
# visit http://localhost:8000
```
 
---
 
## 🐳 Docker Details
 
The `Dockerfile` uses a **two-stage build**:
 
- **Stage 1** (`node:20-alpine`): installs Node deps and runs `npm run build`
- **Stage 2** (`python:3.11-slim`): installs Python deps, copies backend + React build
The final image serves everything from a single FastAPI process on one port. `docker-compose.yml` mounts a named volume (`chroma_data`) to persist the Chroma vector store across restarts.
 
```bash
# Useful commands
docker compose up -d          # run in background
docker compose logs -f        # tail logs
docker compose down           # stop
docker compose up --build -d  # rebuild after code changes
```
 
---
 
## ☁️ Deployment — HuggingFace Spaces
 
Live at: **[https://abhroneel-quantumai.hf.space](https://abhroneel-quantumai.hf.space)**
 
The app is deployed on HuggingFace Spaces (Docker SDK) with **16GB RAM** on the free CPU Basic tier.
 
To redeploy after changes:
 
```bash
git add .
git commit -m "your message"
git push space master:main --force
```
 
HF Spaces auto-rebuilds on every push. Secrets (`GROQ_API_KEY`, `HUGGINGFACEHUB_API_TOKEN`) are set in **Settings → Variables and Secrets**.
 
---
 
## 🎨 Frontend Features
 
| Feature | Details |
|---|---|
| **Particle background** | Animated canvas with 4-color (blue/cyan/violet/green) glowing nodes and gradient connections |
| **Welcome screen** | Floating atom icon + 6 suggested query chips |
| **Collapsible sidebar** | Chat history + model selector + temperature + context chunk sliders |
| **Live config toolbar** | Model, temp, and top-K editable directly in the input bar |
| **Source chunks panel** | Click "N sources" under any AI reply to expand retrieved context passages |
| **Typing indicator** | Animated dots with "Retrieving context…" label |
| **Markdown rendering** | Bold, inline code, headers, bullet lists all rendered natively |
| **Live status indicator** | Green/amber/red pulsing dot in the header |
| **Neon design system** | Deep navy base, electric blue/cyan/violet accents, gradient text, glowing borders |
 
---
 
## 🔄 How It Works
 
```
Browser (React)
    │  POST /chat  {query, top_k, model, temperature}
    ▼
FastAPI (main.py)
    │  retriever.invoke(query)
    ▼
Chroma vector store → top K chunks
    │
    ▼
ChatGroq (Groq API) ← GROQ_API_KEY
    │  answer
    ▼
FastAPI returns {answer, chunks_retrieved, chunks_preview}
    │
    ▼
React renders message + expandable source chunks
```
 
---
 
## 📝 System Prompt Design
 
The LLM is constrained to act as **QuantumAI** — a strict domain-specific assistant defined in `main.py`. API keys never touch the frontend.
 
```
You are QuantumAI, an AI assistant exclusively dedicated to
quantum mechanics and quantum information science.
 
Knowledge scope:
- Quantum entanglement theory, history, experimental evidence
- Bell's theorem, Bell inequalities, EPR paradox
- Quantum information science: teleportation, cryptography, computing
- Quantum hardware: ion traps, superconducting qubits, photonic systems
- Decoherence, entanglement entropy, quantum error correction
 
Instructions:
1. If factual → use retrieved context only
2. If general physics → use model knowledge
3. If both → clearly separate sources
4. If out of scope → politely refuse
```
 
---
 
## 🧪 Sample Test Queries
 
| Type | Query |
|------|-------|
| Factual recall | `"What is quantum entanglement?"` |
| Multi-hop | `"How do Bell's theorem and the EPR paradox relate?"` |
| Application | `"How is entanglement used in quantum cryptography?"` |
| Misconception | `"Can entanglement send information faster than light?"` |
| Out of scope | `"What is the capital of France?"` |
 
---
 
## 🔮 Planned Features
 
- [ ] Upload custom documents via UI
- [ ] Upload and parse images
- [ ] Per-session chat history persistence
- [ ] Multi-document knowledge base support
- [ ] Streaming responses
---
 
## 🙌 Acknowledgements
 
- [Groq](https://groq.com) — ultra-fast LLM inference
- [LangChain](https://langchain.com) — RAG framework
- [HuggingFace](https://huggingface.co) — open-source embeddings + hosting
- [Chroma](https://www.trychroma.com) — vector store
- [FastAPI](https://fastapi.tiangolo.com) — backend framework
- [React](https://react.dev) — frontend framework