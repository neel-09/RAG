# QuantumAI — RAG Pipeline with Groq LLM

A Retrieval-Augmented Generation (RAG) pipeline built with LangChain and Groq, specialized as **QuantumAI** — an AI assistant dedicated exclusively to quantum mechanics and quantum entanglement topics. Includes a FastAPI backend and an interactive web chat UI.

---

## 🧠 What It Does

This project implements a complete RAG system that:

1. Loads a domain-specific knowledge base (quantum entanglement text)
2. Splits and embeds the documents into a Chroma vector store
3. Retrieves the top-K most relevant chunks for a given query
4. Feeds the retrieved context + query into a Groq-hosted LLM via a FastAPI backend
5. Returns a grounded, in-scope answer through an interactive chat UI

---

## 🗂️ Project Structure

```
RAG/
├── .env                                    # API keys (never commit this)
├── quantum_entanglement.txt                # Knowledge base document
├── rag_implementation.ipynb                # Jupyter notebook (RAG experiments)
├── main.py                                 # FastAPI backend server
├── chat.html                               # Interactive chat frontend
├── requirements.txt                        # Python dependencies
└── README.md
```

---

## ⚙️ Tech Stack

| Component        | Tool / Library                     |
|------------------|------------------------------------|
| LLM              | Groq (`llama-3.1-8b-instant`)      |
| RAG Framework    | LangChain                          |
| Embeddings       | HuggingFace Sentence Transformers  |
| Vector Store     | Chroma (Python 3.14 compatible)    |
| Backend API      | FastAPI + Uvicorn                  |
| Frontend         | Vanilla HTML/CSS/JS                |
| Environment Mgmt | `python-dotenv`                    |
| Runtime          | Jupyter Notebook + Browser         |

---

### Start the FastAPI server

```bash
uvicorn main:app --reload
```

### Open the chat UI

Go to your browser and visit:
```
http://127.0.0.1:8000
```

FastAPI serves both the API and the chat UI from the same server.

---

## 🔄 How It Works

```
Browser (chat.html)
    │  POST /chat  {query, top_k, model, temperature}
    ▼
FastAPI (main.py)
    │  retriever.invoke(query)
    ▼
Chroma vector store → top K chunks
    │
    ▼
ChatGroq (Groq API) ← GROQ_API_KEY from .env
    │  answer
    ▼
FastAPI returns {answer, chunks_retrieved, chunks_preview}
    │
    ▼
Browser renders the answer
```

---

## 📝 System Prompt Design

The LLM is constrained to act as **QuantumAI** — a strict domain-specific assistant defined entirely in `main.py`. The API key never touches the frontend.

```
You are QuantumAI, an AI assistant exclusively dedicated to
quantum mechanics and quantum information science.

Knowledge scope:
- Quantum entanglement theory, history, experimental evidence
- Bell's theorem, Bell inequalities, EPR paradox
- Quantum information science: teleportation, cryptography, computing
- Quantum hardware: ion traps, superconducting qubits, photonic systems
- Decoherence, entanglement entropy, quantum error correction

Context: {retrieved chunks from Chroma}
Question: {user query}

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

---

## 🙌 Acknowledgements

- [Groq](https://groq.com) — ultra-fast LLM inference
- [LangChain](https://langchain.com) — RAG framework
- [HuggingFace](https://huggingface.co) — open-source embeddings
- [Chroma](https://www.trychroma.com) — vector store
- [FastAPI](https://fastapi.tiangolo.com) — backend framework