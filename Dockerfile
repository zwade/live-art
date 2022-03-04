FROM node:16

RUN apt-get update && apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2

WORKDIR /problem

COPY yarn ./.yarn
COPY yarnrc.yml ./.yarnrc.yml
COPY package.json yarn.lock ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json

RUN yarn
COPY . .

RUN cd client && yarn vite build
RUN cd server && yarn build

ARG FLAG
RUN mkdir /challenge
RUN yarn prepare-artifacts

WORKDIR /problem/server

# PUBLISH 4000 AS http
EXPOSE 4000

CMD ["node", "dist/index.js"]
