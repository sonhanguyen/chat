FROM node:19.3-slim

WORKDIR /app
COPY . .

WORKDIR /app/dal
RUN npm i
ENTRYPOINT ./scripts init
