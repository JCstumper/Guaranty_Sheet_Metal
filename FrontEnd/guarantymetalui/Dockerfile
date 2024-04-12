# === BASE STAGE ===
# Use an official Node runtime as a parent image
FROM node:20.11.1-bookworm-slim as base

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install any needed packages
RUN npm install
RUN npm install xlsx

# If you are using Yarn, you can use COPY package.json yarn.lock ./ and RUN yarn install instead

# Bundle app source
COPY . .

# === DEVELOPMENT STAGE ===
FROM base as development

# Expose port 3000 for the development server
EXPOSE 3000

# Command to run the app using Nodemon
CMD ["npm", "run", "dev"]

# === PRODUCTION STAGE ===
FROM base as production

# Setting environment variable to the DNS instead of localhost
ENV REACT_APP_API_URL=https://gsminventory.com/api

# Build the React App
RUN npm run build

# Copy the server script
COPY server.js ./

#Install express to start the server
RUN npm install express@latest

# Expose port 3000 for the development server
EXPOSE 3000

#Start the server
CMD ["node", "server.js"]
