# Use Node.js official image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
#RUN npx prisma generate

# Expose the backend port (adjust if different)
EXPOSE 5000

# Run the application
CMD ["npm", "run", "dev"]
