# Multi-stage Docker build for React Dashboard + Python Script

# Stage 1: Build the React application
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production environment with nginx and Python
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nginx \
    cron \
    supervisor \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create nginx log directory
RUN mkdir -p /var/log/nginx

# Create app user
RUN useradd -r -s /bin/bash app

# Create log directory and set permissions
RUN mkdir -p /var/log/nginx && \
    touch /var/log/panel_upload.log && \
    chown app:app /var/log/panel_upload.log && \
    chown -R app:app /app

# Set up nginx
COPY nginx.conf /etc/nginx/nginx.conf
RUN nginx -t

# Set up Python environment
WORKDIR /app

# Build arguments for GitLab credentials
ARG GL_USER
ARG GL_PASSWORD

# Copy and substitute credentials in requirements.txt
COPY requirements.txt .
RUN sed -i "s/__GL_USER__/${GL_USER}/" requirements.txt && \
    sed -i "s/__GL_PASSWORD__/${GL_PASSWORD}/" requirements.txt && \
    pip install --no-cache-dir -r requirements.txt

# Copy Python script
COPY scripts/ ./scripts/
RUN chmod +x ./scripts/panel_upload.py

# Copy built React application from build stage
COPY --from=build /app/dist /var/www/html

# Set up supervisord
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set up cron job for Python script
RUN echo "0 */4 * * * /usr/local/bin/python /app/scripts/panel_upload.py >> /var/log/panel_upload.log 2>&1" | crontab -u app -

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
