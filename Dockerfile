FROM node:14 as base

WORKDIR /home/node/app

COPY package.json ./

RUN npm install pm2 -g && \
npm install

# RUN npm install --production --quiet

COPY . .

FROM base as production

ENV NODE_PATH=./build

RUN npm run build