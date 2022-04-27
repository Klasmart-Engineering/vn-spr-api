FROM node:16-alpine

ARG NODE_AUTH_TOKEN

WORKDIR /usr/app

COPY package.json tsconfig.json ./

RUN echo "progress=false" > .npmrc

RUN echo "//npm.pkg.github.com/:_authToken=$NODE_AUTH_TOKEN" > .npmrc

RUN echo "@kl-engineering:registry=https://npm.pkg.github.com" > .npmrc

COPY src ./src

RUN npm install

RUN rm -f .npmrc

EXPOSE 4200

CMD npm start
