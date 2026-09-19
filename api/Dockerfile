# Use a lightweight base image (Alpine)
FROM node:24-alpine

# Set the working directory
WORKDIR /usr/src/app

# Layer Caching: Copy package files first
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of the application source code
COPY . .

# Set a non-root user for security (Least Privilege)
USER node

# Expose the API port (internally)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
