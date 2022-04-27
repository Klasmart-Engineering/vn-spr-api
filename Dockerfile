# First build
FROM node:16-alpine AS build

ARG NODE_AUTH_TOKEN

WORKDIR /usr/app

COPY package.json tsconfig.json ./

COPY src ./src

RUN echo -e "\
progress=false \n\
//npm.pkg.github.com/:_authToken=$NODE_AUTH_TOKEN \n\
@kl-engineering:registry=https://npm.pkg.github.com \
" > .npmrc && npm install && rm -r .npmrc

# Second build
FROM node:16-alpine

WORKDIR /usr/app

EXPOSE 4200

COPY --from=build /usr/app /usr/app

CMD npm start
