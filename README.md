# Student performance report

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Installation

Setup environment variables:

- Create a `.env` file by copying the contents of `.env.example`
- Change the value of `SHOW_SWAGGER` to `true` if you want to see Swagger document on your local machine.

Install dependencies:

- `npm i`

## Running

Start the application:

- `npm start`
- or, `npm run start:dev` for nodemon monitoring & live reloading

### Docker

You can also run the application with its dependencies through a docker-compose. For this just run:

- `docker-compose up`

### Swagger

Swagger document is built with [tsoa](https://github.com/lukeautry/tsoa), please check its [document](https://tsoa-community.github.io/docs/) for further information.
