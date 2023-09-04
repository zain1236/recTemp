# Use the official Node.js image as the base image
FROM node:18.16.1

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
#RUN npm run build

# Create a lightweight production image
#FROM nginx:alpine

# Copy the build output from the previous stage to the nginx directory
#COPY --from=build /app/build /usr/share/nginx/html

# Expose the port the app runs on (Nginx default is 80)
EXPOSE 3000

# Start Nginx when the container starts
CMD ["npm", "start"]