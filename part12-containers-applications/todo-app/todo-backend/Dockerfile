FROM node:16

WORKDIR /usr/src/app

ENV REDIS_URL=//localhost:6378
ENV MONGO_URL=mongodb://admin:strongestPasswordPfft@localhost:3456/the_database
ENV MONGO_INITDB_ROOT_USERNAME: 'admin'
ENV MONGO_INITDB_ROOT_PASSWORD: 'strongestPasswordPfft'
ENV MONGO_INITDB_DATABASE: the_database

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000 
CMD ["npm", "start"]


