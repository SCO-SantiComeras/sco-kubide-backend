FROM node:16-alpine3.18

RUN addgroup backend && adduser -S -G backend backend
USER backend

WORKDIR /app/

COPY --chown=backend package*.json .

RUN npm install
RUN npm i cross-env

COPY --chown=backend . .

EXPOSE 3000
CMD ["npm", "run", "start:dev"]