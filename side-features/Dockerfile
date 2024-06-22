FROM node:20

WORKDIR /usr/crealth

COPY package*.json ./

ENV PORT=3000

EXPOSE 3000

RUN npm install
RUN npm update

COPY . .

CMD ["npm","start"]