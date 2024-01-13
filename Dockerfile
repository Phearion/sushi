FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=51000

EXPOSE 42125

CMD [ "npm", "start" ]

