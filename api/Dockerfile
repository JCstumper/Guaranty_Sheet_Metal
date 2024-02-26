# Use an official Node.js runtime as a parent image
FROM node:lts

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install any dependencies, ensuring native modules are built correctly
RUN npm install
RUN npm audit fix --force

# Copy the rest of your application's code
COPY . .

# Your app listens on some port, so you'll expose that port
EXPOSE 3000

CMD ["node", "server.js"]

