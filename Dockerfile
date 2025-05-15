# Use Node.js LTS base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5500
EXPOSE 5500

# Start the app using nodemon
CMD ["npm", "start"]
