FROM node:19.3-slim

WORKDIR /app
COPY . .

WORKDIR /app/server/dal
RUN npm i
ENTRYPOINT ./cmd init
