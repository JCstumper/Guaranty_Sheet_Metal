# Use an official Node runtime as a base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container
COPY . .

# Install any dependencies
RUN npm install

# Build the React app
RUN npm run build

# Install serve to serve the static files
RUN npm install -g serve

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Serve the static files from the build directory
CMD ["serve", "-s", "build", "-l", "3000"]
