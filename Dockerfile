# ─────────────────────────────────────────────
# Stage 1 — Build React frontend
# ─────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Install deps first (layer cache)
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --silent

# Copy source and build
COPY frontend/ .
RUN npm run build


# ─────────────────────────────────────────────
# Stage 2 — Python backend + serve React build
# ─────────────────────────────────────────────
FROM python:3.11-slim

# System deps (needed by some HuggingFace / tokenizer packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY main.py .
COPY quantum_entanglement.txt .

# Copy React build from stage 1
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Create non-root user for security
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

# Chroma persists to this dir at runtime — make sure it exists
RUN mkdir -p /app/chroma_db

EXPOSE 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860", "--workers", "1"]