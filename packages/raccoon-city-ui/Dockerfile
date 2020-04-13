FROM node:10.15.0

RUN mkdir -p /raccoon-city-ui

WORKDIR /raccoon-city-ui
ENV PATH /raccoon-city-ui/node_modules/.bin:$PATH
COPY . /raccoon-city-ui

RUN yarn --pure-lockfile

CMD [ "yarn", "start" ]
