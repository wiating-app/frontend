FROM node:10.16-alpine AS base


WORKDIR /code

COPY yarn.lock /code

RUN yarn install

COPY . /code
