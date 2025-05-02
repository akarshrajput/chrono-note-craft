# Use an official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your project
COPY . .

# Expose the port Vite runs on
EXPOSE 5173
# Run the dev server
CMD ["npm", "run", "dev"]

# # Use Bun official image
# FROM oven/bun:1

# # Set working directory
# WORKDIR /app

# # Copy files
# COPY . .

# # Install dependencies using Bun
# RUN bun install

# # Build the app using Vite
# RUN bun run build

# # Expose the port Vite serves on (default: 5173 or use preview port)
# EXPOSE 4173

# # Start the production server
# CMD ["bun", "run", "preview"]
