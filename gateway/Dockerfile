FROM node:alpine as builder
WORKDIR /srv/app
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build

FROM node:alpine
WORKDIR /srv/app
COPY package.json package.json
RUN npm install --only=prod
COPY --from=builder /srv/app/dist .
ENTRYPOINT node .
