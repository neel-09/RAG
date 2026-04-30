# from fastapi import FastAPI, Response
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# from fastapi.responses import FileResponse
# from pydantic import BaseModel
# from dotenv import load_dotenv
# import os
# import warnings
# warnings.filterwarnings("ignore")
# from langchain_groq import ChatGroq
# from langchain_community.document_loaders import TextLoader
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_community.vectorstores import Chroma
# from langchain_core.messages import HumanMessage, SystemMessage

# load_dotenv()  # loads GROQ_API_KEY from .env
# os.environ["HUGGINGFACEHUB_API_TOKEN"] = os.getenv("HUGGINGFACEHUB_API_TOKEN", "")
# app = FastAPI()

# # Allow your HTML file to call this API
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ── Build RAG retriever on startup ──
# print("Loading knowledge base...")
# loader = TextLoader("quantum_entanglement.txt")
# documents = loader.load()

# splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
# chunks = splitter.split_documents(documents)

# embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
# vectorstore = Chroma.from_documents(chunks, embeddings)
# retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# print(f"Knowledge base ready. {len(chunks)} chunks indexed.")

# # ── LLM ──
# llm = ChatGroq(
#     groq_api_key=os.getenv("GROQ_API_KEY"),
#     model="llama-3.1-8b-instant",
#     temperature=0.1,
#     max_tokens=1024
# )

# # ── Request schema ──
# class QueryRequest(BaseModel):
#     query: str
#     top_k: int = 3
#     model: str = "llama-3.1-8b-instant"
#     temperature: float = 0.1

# # ── /chat endpoint ──
# @app.post("/chat")
# def chat(req: QueryRequest):
#     # Retrieve relevant chunks
#     docs = retriever.invoke(req.query)
#     # no chunk labels
#     context = "\n\n".join([d.page_content for d in docs])
#     chunks_preview = [d.page_content[:120] for d in docs]

#     system_prompt = f"""You are QuantumAI, an AI assistant exclusively dedicated to quantum mechanics and quantum information science.

# Your knowledge scope is strictly limited to:
# - Quantum entanglement theory, history, and experimental evidence
# - Bell's theorem, Bell inequalities, and EPR paradox
# - Quantum information science: teleportation, cryptography, and computing
# - Quantum hardware: ion traps, superconducting qubits, photonic systems
# - Decoherence, entanglement entropy, and quantum error correction

# You are NOT permitted to answer questions outside this scope under any circumstances.

# Here is the retrieved knowledge context:
# {context}

# Instructions:
# 1. If the question is factual, answer strictly using the provided context.
# 2. If it is a general quantum mechanics question, use your knowledge.
# 3. If combining both, clearly state what is from the document vs general knowledge.
# 4. If the question is outside your scope, politely refuse.

# Respond clearly. Use **bold** for key terms."""

#     # Swap model/temperature dynamically if changed in frontend
#     dynamic_llm = ChatGroq(
#         groq_api_key=os.getenv("GROQ_API_KEY"),
#         model=req.model,
#         temperature=req.temperature,
#         max_tokens=1024
#     )

#     messages = [
#         SystemMessage(content=system_prompt),
#         HumanMessage(content=req.query)
#     ]

#     response = dynamic_llm.invoke(messages)

#     return {
#         "answer": response.content,
#         "chunks_retrieved": len(docs),
#         "chunks_preview": chunks_preview
#     }

# @app.get("/favicon.ico")
# def favicon():
#     return Response(status_code=204)
    
# # ── Health check ──
# @app.get("/health")
# def health():
#     return {"status": "ok", "model": "llama-3.1-8b-instant"}

# # ── Serve the HTML file ──
# @app.get("/")
# def serve_frontend():
#     return FileResponse("chat.html")


from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import warnings
warnings.filterwarnings("ignore")
from langchain_groq import ChatGroq
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.messages import HumanMessage, SystemMessage

load_dotenv()
os.environ["HUGGINGFACEHUB_API_TOKEN"] = os.getenv("HUGGINGFACEHUB_API_TOKEN", "")

app = FastAPI()

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Build RAG retriever on startup ──
print("Loading knowledge base...")
loader = TextLoader("quantum_entanglement.txt")
documents = loader.load()

splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(documents)

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-MiniLM-L3-v2"
)
vectorstore = Chroma.from_documents(chunks, embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

print(f"Knowledge base ready. {len(chunks)} chunks indexed.")

# ── LLM ──
llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.1-8b-instant",
    temperature=0.1,
    max_tokens=1024
)

# ── Request schema ──
class QueryRequest(BaseModel):
    query: str
    top_k: int = 3
    model: str = "llama-3.1-8b-instant"
    temperature: float = 0.1

# ── /chat endpoint ──
@app.post("/chat")
def chat(req: QueryRequest):
    docs = retriever.invoke(req.query)
    context = "\n\n".join([d.page_content for d in docs])
    chunks_preview = [d.page_content[:120] for d in docs]

    system_prompt = f"""You are QuantumAI, an AI assistant exclusively dedicated to quantum mechanics and quantum information science.

Your knowledge scope is strictly limited to:
- Quantum entanglement theory, history, and experimental evidence
- Bell's theorem, Bell inequalities, and EPR paradox
- Quantum information science: teleportation, cryptography, and computing
- Quantum hardware: ion traps, superconducting qubits, photonic systems
- Decoherence, entanglement entropy, and quantum error correction

You are NOT permitted to answer questions outside this scope under any circumstances.

Here is the retrieved knowledge context:
{context}

Instructions:
1. If the question is factual, answer strictly using the provided context.
2. If it is a general quantum mechanics question, use your knowledge.
3. If the question is outside your scope, politely refuse.

Respond clearly. Use **bold** for key terms."""

    dynamic_llm = ChatGroq(
        groq_api_key=os.getenv("GROQ_API_KEY"),
        model=req.model,
        temperature=req.temperature,
        max_tokens=1024
    )

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=req.query)
    ]

    response = dynamic_llm.invoke(messages)

    return {
        "answer": response.content,
        "chunks_retrieved": len(docs),
        "chunks_preview": chunks_preview
    }

@app.get("/favicon.ico")
def favicon():
    return Response(status_code=204)

# ── Health check ──
@app.get("/health")
def health():
    return {"status": "ok", "model": "llama-3.1-8b-instant"}

# ── Serve React build (must come AFTER API routes) ──
REACT_BUILD = os.path.join(os.path.dirname(__file__), "frontend", "build")

if os.path.exists(REACT_BUILD):
    # Serve static assets (JS, CSS, images)
    app.mount("/static", StaticFiles(directory=os.path.join(REACT_BUILD, "static")), name="static")

    @app.get("/")
    def serve_index():
        return FileResponse(os.path.join(REACT_BUILD, "index.html"))

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        """Catch-all: serve React's index.html for any unknown route (SPA routing)."""
        file_path = os.path.join(REACT_BUILD, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(REACT_BUILD, "index.html"))
else:
    # Fallback: warn that the React build hasn't been generated yet
    @app.get("/")
    def serve_no_build():
        return Response(
            content="<h2>React build not found. Run <code>cd frontend && npm install && npm run build</code> first.</h2>",
            media_type="text/html",
            status_code=503,
        )