FROM node:16
USER root
WORKDIR /usr/src/app

COPY package*.json ./ 
RUN npm install

COPY . .

ENV CI=true
RUN chown -R node:node .
USER node
RUN npm ci
RUN npm run test

EXPOSE 3000
CMD ["npm", "start"]

