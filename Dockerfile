FROM node:16-alpine

WORKDIR /usr/app

COPY package.json tsconfig.json ./
COPY src ./src

RUN npm install

EXPOSE 4200

CMD npm start
