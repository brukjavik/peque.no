# Build
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Runtime com NGINX
FROM nginx:alpine
COPY --from=build /app/dist/front-peque.no/browser/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80