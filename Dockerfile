FROM node:latest

WORKDIR /app/src

COPY package*.json ./

RUN npm install 

COPY tsconfig.json ./

COPY . .

RUN npm run build

EXPOSE 4004

CMD ["npm", "start"]
