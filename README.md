# QuantumAI — RAG Pipeline with Groq LLM

A Retrieval-Augmented Generation (RAG) pipeline built with LangChain and Groq, specialized as **QuantumAI** — an AI assistant dedicated exclusively to quantum mechanics and quantum entanglement topics.

---

## 🧠 What It Does

This project implements a simple but complete RAG system that:

1. Loads a domain-specific knowledge base (quantum entanglement text)
2. Splits and embeds the documents into a vector store
3. Retrieves the top-K most relevant chunks for a given query
4. Feeds the retrieved context + query into a Groq-hosted LLM
5. Returns a grounded, in-scope answer via a custom system prompt

---

## 🗂️ Project Structure

```
RAG/
├── .env                          # API keys (never commit this)
├── quantum_entanglement_.txt   # Knowledge base document
├── rag_implementation.ipynb            # Main Jupyter notebook
└── README.md
```

---

## ⚙️ Tech Stack

| Component        | Tool / Library                     |
|------------------|------------------------------------|
| LLM              | Groq (`llama-3.1-8b-instant`)      |
| RAG Framework    | LangChain                          |
| Embeddings       | HuggingFace Sentence Transformers  |
| Vector Store     | FAISS / Chroma                     |
| Environment Mgmt | `python-dotenv`                    |
| Runtime          | Jupyter Notebook                   |

---

## 🚀 Setup & Installation

### 2. Create and activate a virtual environment

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install langchain langchain-groq langchain-community \
            sentence-transformers faiss-cpu python-dotenv
```

### 4. Set up your API key

Create a `.env` file in the project root:

```env
GROQ_API_KEY=gsk_your_actual_key_here
```


### Run a RAG query

```python
answer = rag_simple("What is quantum entanglement?", rag_retriever, llm)
print(answer)
```

---

## 📝 System Prompt Design

The LLM is constrained to act as **QuantumAI** — a domain-specific assistant. The prompt structure is:

```
You are QuantumAI, an AI assistant exclusively dedicated to
quantum mechanics and quantum information science.

[scope definition]

Context: {context}        ← Retrieved chunks from vector store
Question: {query}         ← User's question

Instructions:
1. If factual → use retrieved context only
2. If general physics → use model knowledge
3. If both → clearly separate sources
4. If out of scope → politely refuse
```

---

## 🧪 Sample Test Queries

Use these to evaluate RAG performance:

| Type | Query |
|------|-------|
| Factual recall | `"What is quantum entanglement?"` |
| Multi-hop | `"How do Bell's theorem and the EPR paradox relate?"` |
| Application | `"How is entanglement used in quantum cryptography?"` |
| Misconception | `"Can entanglement send information faster than light?"` |
| Out of scope | `"What is the capital of France?"` |


---

## 🙌 Acknowledgements

- [Groq](https://groq.com) — ultra-fast LLM inference
- [LangChain](https://langchain.com) — RAG framework
- [HuggingFace](https://huggingface.co) — open-source embeddings