# Base image with Python
FROM python:3.9

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for Node.js
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the modifyGradio.js script
COPY modifyGradio.js ./

# Run the fix:gradio
RUN npm run fix:gradio

# Copy the rest of the Node.js application
COPY . .

# Create and activate the Python virtual environment
RUN python -m venv sushi-venv
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
