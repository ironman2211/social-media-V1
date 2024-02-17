# Use official Node.js image as base
FROM node:slim

# Set working directory in the container
WORKDIR /app

RUN npm install -g npm@10.4.0
# Copy package.json files for both server and client to the container
COPY server/package.json ./server/
COPY client/package.json ./client/

# Install dependencies for both server and client
RUN cd server && npm install --force
RUN cd client && npm install --force

# Copy server and client code to the container
COPY server/ ./server/
COPY client/ ./client/

# Expose the port your server is running on
EXPOSE 3001

# Command to run both server and client
CMD ["npm", "start"]
