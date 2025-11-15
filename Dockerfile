FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
ARG CMD="npm start"
CMD ["/bin/sh", "-c", "$CMD"]