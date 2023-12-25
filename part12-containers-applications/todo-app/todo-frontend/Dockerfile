FROM node:16
USER root
WORKDIR /usr/src/app

COPY package*.json ./ 
RUN npm install -g serve

COPY . .

RUN chown -R node:node /usr/src/app
USER node

EXPOSE 3000
CMD ["serve","-s","build"]
