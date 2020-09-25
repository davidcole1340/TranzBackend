FROM node:14.11

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install
COPY . .

CMD [ "npm", "run", "start:watch" ]