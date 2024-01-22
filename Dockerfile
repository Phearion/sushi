FROM node:20
FROM python:3.10

WORKDIR /usr/src/app

# create a virtual env called sushi-venv if it doesn't exist already
RUN python3 -m venv sushi-venv

# activate the virtual env
RUN . sushi-venv/bin/activate

# install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# install nodejs dependencies
COPY package*.json ./
RUN npm install

COPY . .

ARG PORT
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD [ "npm", "run", "prod" ]

