FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --upgrade pip==25.3 wheel==0.46.2

COPY backend/requirements.txt .

# Installer les deps dans /app/libs (sera copie dans le stage Distroless)
RUN pip install --no-cache-dir --target=/app/libs -r requirements.txt

# Creer le dossier data ici (impossible avec RUN dans Distroless)
RUN mkdir -p /app/data

# -- Stage 2 : Runtime Distroless --
FROM gcr.io/distroless/python3-debian12

WORKDIR /app

# Copier les packages Python depuis le builder
COPY --from=builder /app/libs /app/libs

# Copier le dossier data (vide, pour SQLite)
COPY --from=builder /app/data /app/data

# Copier le code applicatif et le frontend
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# PYTHONPATH pointe vers les deps copiees depuis le builder
ENV PYTHONPATH=/app/libs
ENV FLASK_ENV=production
ENV FLASK_APP=app.py
ENV DATABASE_URL=sqlite:////app/data/dating_app.db

EXPOSE 5000

WORKDIR /app/backend

# Distroless n'a pas de shell -> exec form obligatoire
CMD ["app.py"]