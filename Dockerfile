FROM node:10.17-alpine AS base

WORKDIR /code

COPY package.json /code

COPY yarn.lock /code

RUN yarn install
