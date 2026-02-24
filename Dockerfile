# Use a small, stable base image
FROM node:20.16.0-alpine3.20

# Set working directory
WORKDIR /usr/src/app

# Copy only package files first (caches npm install if code changes but deps don't)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the app (respects .dockerignore)
COPY . .

# Expose the port (read from env or fallback to 3000)
EXPOSE 3000

# Run the app
CMD ["node", "app.js"]
