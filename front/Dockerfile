FROM node:18-alpine

RUN mkdir -p /home/front-next-sass

COPY . ./front-next-sass

WORKDIR /front-next-sass

RUN yarn

EXPOSE 3000

CMD ["npm", "run", "dev"]