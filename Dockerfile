FROM node:current-alpine


RUN mkdir awithrow.dev
WORKDIR /awithrow.dev

COPY package.json .
COPY package-lock.json .
RUN npm install
COPY build/ ./build
COPY src/md/ src/md

EXPOSE 9001
ENV PORT 9001

ENTRYPOINT [ "node","build" ]
