# First stage: Node.js
FROM node:20 AS build-node

# Set working directory for Node.js
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy Node.js related files
COPY . .

# Second stage: Python with Node.js
FROM python:3.9

# Copy Node.js build artifacts from the first stage
COPY --from=build-node /usr/src/app .

# Set working directory for Python
WORKDIR /usr/src/app

# Create and activate the virtual environment
RUN python3.9 -m venv sushi-venv
RUN . sushi-venv/bin/activate

# Install Python dependencies
RUN sushi-venv/bin/pip install --upgrade pip
RUN sushi-venv/bin/pip install -r requirements.txt

# Environment variable for the port
ARG PORT
ENV PORT=${PORT}

# Expose the port
EXPOSE ${PORT}

# Command to run the application
CMD [ "npm", "run", "prod" ]
