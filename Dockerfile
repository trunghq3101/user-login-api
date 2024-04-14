# Use the official Node.js image as a parent image
FROM node:20.12.2-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install NestJS dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3000
EXPOSE 3000

# Build the application
RUN yarn build

# Command to run the application
CMD ["yarn", "start:prod"]
