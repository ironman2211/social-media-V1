FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./


RUN npm cache clean --force


RUN npm inst`all

# Rebuild bcrypt inside the Docker container
RUN npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
