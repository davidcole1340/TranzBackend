FROM node:14.11

WORKDIR /usr/src/app

RUN apt-get -y update && apt-get install -y wget unzip
RUN wget -q "https://fastdl.mongodb.org/tools/db/mongodb-database-tools-debian10-x86_64-100.1.1.tgz" -O tools.tgz
RUN tar -xvf tools.tgz
RUN mv mongodb-database-tools-debian10-x86_64-100.1.1/bin/mongoimport /usr/bin/mongoimport

COPY package.json ./
RUN npm install
COPY . .

EXPOSE 8080

RUN npm run build
CMD [ "npm", "start" ]