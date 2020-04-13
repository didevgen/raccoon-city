FROM node:10.15.0

RUN mkdir -p /raccoon-city-graphql

WORKDIR /raccoon-city-graphql
COPY package.json /raccoon-city-graphql
COPY yarn.lock /raccoon-city-graphql
RUN yarn
RUN yarn build
COPY ./dist .
EXPOSE 4000
CMD [ "yarn", "start" ]

