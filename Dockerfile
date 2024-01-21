# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Открыть порт, на котором запущено приложение
EXPOSE 3000

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
