# Use an official Node runtime as a parent image
FROM node:20.11.1-bookworm-slim

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

<<<<<<< HEAD
#ENV HTTPS=true
=======
# ENV HTTPS=true
>>>>>>> origin/main

# Expose port 3000 for the development server
EXPOSE 3000

# Command to run the app using Nodemon
CMD ["npm", "run", "dev"]
