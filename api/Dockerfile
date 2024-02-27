FROM node:20.11.0

WORKDIR /app

COPY . /app 

RUN npm install

EXPOSE 3000

ENV NAME api

CMD ["npm", "start"]