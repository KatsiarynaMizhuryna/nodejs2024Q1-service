FROM node:20.11-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
# Build
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "run", "start:dev"]