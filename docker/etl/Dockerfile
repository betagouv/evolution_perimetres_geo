FROM node:16.13.2

RUN apt-get update && apt-get install -y p7zip-full \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /etl
COPY ./package.json /etl
RUN npm install
