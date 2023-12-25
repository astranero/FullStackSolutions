FROM node:16
USER root  
WORKDIR /usr/src/app

COPY . .
 
RUN chown -R node:node /usr/src/app
USER node

RUN npm install
ENV DEBUG=todo-backend:*

CMD npm run dev
