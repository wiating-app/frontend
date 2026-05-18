FROM node:14-alpine AS base

WORKDIR /code

COPY package.json /code
COPY prepare.js /code
COPY yarn.lock /code

RUN yarn install
