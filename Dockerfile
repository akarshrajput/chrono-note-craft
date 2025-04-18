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