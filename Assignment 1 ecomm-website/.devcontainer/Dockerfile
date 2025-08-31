# Use Node.js LTS version optimized for Docker Desktop v24.0.6
FROM node:20-bullseye-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    sqlite3 \
    python3 \
    build-essential \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install global npm packages
RUN npm install -g prisma@latest \
    && npm install -g concurrently@latest

# Set working directory
WORKDIR /workspace

# Set environment variables
ENV NODE_ENV=development
ENV NPM_CONFIG_CACHE=/tmp/.npm
ENV NPM_CONFIG_UPDATE_NOTIFIER=false

# Create directories for uploads and database
RUN mkdir -p /workspace/public/uploads \
    && mkdir -p /workspace/server/prisma \
    && mkdir -p /tmp/.npm

# Expose ports
EXPOSE 5173 4000 5555

# Default command (overridden by devcontainer)
CMD ["bash"]
