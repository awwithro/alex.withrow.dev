FROM node:current-alpine

RUN apk update && apk add go
RUN go install github.com/charmbracelet/glow@latest && cp /root/go/bin/glow /bin

RUN mkdir alex.withrow.dev
WORKDIR /alex.withrow.dev

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY build/ ./build
COPY src/md/ src/md

EXPOSE 9001
ENV PORT=9001

ENTRYPOINT [ "node","build" ]
