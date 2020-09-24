FROM node:14-alpine AS base


WORKDIR /code

COPY yarn.lock /code

RUN yarn install

COPY . /code
