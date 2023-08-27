# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Set the environment variables
ENV NODE_ENV=production

# Copy the .env file to the container
COPY config.env .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Builld JS
RUN npm run build 

# Run server when the container launches
CMD ["npm", "run", "start:prod"]