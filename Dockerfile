# First stage: Node.js
FROM node:20 AS build-node

WORKDIR /usr/src/app

# Install Node.js dependencies
COPY package*.json ./
RUN npm install

# Second stage: Python
FROM python:3.10

WORKDIR /usr/src/app

# Copy Node.js build artifacts from the first stage
COPY --from=build-node /usr/src/app/node_modules ./node_modules
COPY --from=build-node /usr/src/app/package*.json ./

# Copy the rest of the application
COPY . .

# Create and activate the virtual environment
RUN python3 -m venv sushi-venv
RUN . sushi-venv/bin/activate

# Install Python dependencies
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

ARG PORT
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD [ "npm", "run", "prod" ]