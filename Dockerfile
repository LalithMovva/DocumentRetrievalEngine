# This Dockerfile builds the React front end for nginx.
# It also proxies /api requests to api:5000

# Build step #1: build the React front end
FROM node as build-step
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json package-lock.json ./
COPY ./src ./src
COPY ./public ./public
RUN npm install
RUN npm run build

# Build step #2: build an nginx container
FROM nginx
COPY --from=build-step /app/build /usr/share/nginx/html
COPY /.nginx/nginx.conf /etc/nginx/conf.d/default.conf