# Stage 1: Build Vite React TypeScript App
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
