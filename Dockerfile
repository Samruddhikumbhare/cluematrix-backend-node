# Use Node.js LTS base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application files
COPY . .

# Set environment variable if not using .env directly
# ENV PORT=5500

# Expose port
EXPOSE 5500

# Start the app (ensure this works with npm start)
CMD ["npm", "start"]
