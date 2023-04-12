FROM node:current-alpine


RUN mkdir awithrow.dev
WORKDIR /awithrow.dev

RUN apk update && apk add go
RUN go install github.com/charmbracelet/glow@latest && cp /root/go/bin/glow /bin

COPY package.json .
COPY package-lock.json .
RUN npm install
COPY build/ ./build
COPY src/md/ src/md

EXPOSE 9001
ENV PORT 9001

ENTRYPOINT [ "node","build" ]
