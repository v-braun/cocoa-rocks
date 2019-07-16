FROM node:10 AS build-env
WORKDIR /app
COPY ./package.json ./
RUN npm install

COPY ./src/ ./src
COPY ./gulp-tasks/ ./gulp-tasks
COPY ./gulp-compile-data.js ./
COPY ./gulpfile.js ./
COPY ./conf.js ./

RUN npm run dist

FROM nginx
COPY ./hosting/nginx.conf /etc/nginx/nginx.conf
COPY ./hosting/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-env /app/bin /usr/share/nginx/html/