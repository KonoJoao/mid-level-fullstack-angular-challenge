FROM node:20.18.3-alpine

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli

RUN npm install --legacy-peer-deps

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]
