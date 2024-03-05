# Use an official Node runtime as a parent image
FROM node:lts

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install any needed packages
RUN npm install

# If you are using Yarn, you can use COPY package.json yarn.lock ./ and RUN yarn install instead

# Bundle app source
COPY . .

# ENV HTTPS=true

# Expose port 3000 for the development server
EXPOSE 3000

# Command to run the app using Nodemon
CMD ["npm", "run", "dev"]
