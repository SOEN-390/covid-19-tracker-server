FROM node:latest@sha256:1ce86d32c73efe0aed0fa2dd7c0ee6d5c03f66e75986736d2d97d0ce1400c0a3

ARG PORT

# TypeScript
RUN npm install -g typescript@4.1.2

RUN mkdir /code/
WORKDIR /code/

COPY package.json .

# Install all Packages
RUN npm install

# Copy all other source code to work directory
COPY src src
COPY tests tests
COPY tsconfig.json ./

# compile ts to js
RUN tsc --skipLibCheck

CMD npm start