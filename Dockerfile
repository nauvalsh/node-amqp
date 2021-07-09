FROM node:14 as base

RUN apt-get update

WORKDIR /home/node/app

COPY package.json ./

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.6.0/wait /wait
RUN chmod +x /wait

RUN npm install pm2 typescript -g && \
npm install

# RUN npm install --production --quiet

COPY . .

FROM base as production

ENV NODE_PATH=./build

RUN npm run build
