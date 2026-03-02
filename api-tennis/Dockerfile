# Use official Node.js Alpine base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency manifests first (better layer caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev && \
    npm cache clean --force

# Copy application source
COPY . .

# CRITICAL: Allow OpenShift arbitrary UID support
# OpenShift runs container with random UID and GID=0
RUN chgrp -R 0 /app && \
    chmod -R g+rwX /app

# Expose application port
EXPOSE 8080

# Start application
CMD ["node", "server.js"]
