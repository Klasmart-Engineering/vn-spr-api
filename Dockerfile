ARG NODE_AUTH_TOKEN

FROM node:16-alpine

WORKDIR /usr/app

COPY package.json tsconfig.json .npmrc ./

COPY src ./src

RUN npm install

RUN rm -f .npmrc

EXPOSE 4200

CMD npm start
