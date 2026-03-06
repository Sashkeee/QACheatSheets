# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Отключаем строгую проверку SSL, если на сервере GitHub возникают проблемы с сертификатами (иногда помогает при npm install)
RUN npm config set strict-ssl false

COPY package*.json ./
# Используем --legacy-peer-deps для обхода конфликтов версий react 19
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
