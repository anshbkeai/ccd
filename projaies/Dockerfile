# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .

# Install core dependencies
RUN pip install --no-cache-dir \
    fastapi==0.115.6 \
    uvicorn[standard]==0.34.0 \
    kafka-python==2.0.2 \
    scikit-learn==1.6.1 \
    joblib==1.4.2 \
    xgboost==2.1.3 \
    pydantic==2.10.6 \
    && pip install --no-cache-dir -r requirements.txt || true

# Copy application files
COPY api.py feature_pipeline.py ./

# Copy models directory (ensure this exists with your trained models)
COPY models/ ./models/

# Expose port
EXPOSE 8000

# Health check for ECS
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
