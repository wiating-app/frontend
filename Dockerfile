FROM node:10.17-alpine AS base

WORKDIR /code

COPY . /code

RUN yarn install
