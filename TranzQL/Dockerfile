FROM node:14.11

WORKDIR /usr/src/app

RUN ARCH= && \
    dpkgArch="$(dpkg --print-architecture)" && \
    case "${dpkgArch##*-}" in \
        amd64) ARCH='x86_64';; \
        i386) ARCH='x86_64';; \
        arm64) ARCH='arm64';; \
        *) echo "Unsupported architecture"; exit 1 ;; \
    esac && \
    wget -q "https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2004-$ARCH-100.3.1.tgz" -O tools.tgz && \
    tar -xvf tools.tgz && \
    mv mongodb-database-tools-ubuntu2004-$ARCH-100.3.1/bin/mongoimport /usr/bin/mongoimport

COPY package.json ./
RUN npm install
COPY . .

EXPOSE 8080

RUN npm run build
CMD [ "npm", "start" ]
