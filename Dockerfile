FROM node:latest@sha256:0bb57a145304c637c9e03cde714ec1cff7182215c3d326134312ac0121862405

ARG PORT

RUN mkdir /code/
WORKDIR /code/

COPY package.json ./

# Install all Packages
RUN npm install


# TypeScript
RUN npm install -g typescript@4.1.2

# Copy all other source code to work directory
COPY src src
COPY tests tests
COPY tsconfig.json ./

# compile ts to js
RUN tsc --skipLibCheck

CMD npm start