# Build stage
FROM node:14-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Local stage (Nginx)
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
