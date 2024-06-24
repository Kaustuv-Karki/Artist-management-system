FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm rebuild bcrypt

EXPOSE 5000

CMD ["node", "index.js"]