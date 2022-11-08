FROM node:18

WORKDIR /lib

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

CMD [ "npm", "test" ]
