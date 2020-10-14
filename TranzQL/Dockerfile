FROM node:14.11

WORKDIR /usr/src/app

RUN apt-get -y update && apt-get install -y wget unzip mongo-tools

COPY package.json ./
RUN npm install
COPY . .

EXPOSE 8080

RUN npm run build
CMD [ "npm", "start" ]