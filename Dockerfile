FROM node:19.3-slim

WORKDIR /app
COPY . .

RUN npm i
ENTRYPOINT ./cmd start
