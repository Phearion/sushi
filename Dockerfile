FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ARG PORT
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD [ "npm", "run", "prod" ]

