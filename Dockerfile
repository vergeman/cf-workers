# syntax=docker/dockerfile:1

FROM node:18.12.1

RUN apt-get update && apt-get install -y zsh
RUN wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh || true

COPY . /cf-workers
WORKDIR /cf-workers
RUN npm install
RUN npm install -g wrangler

CMD ["wrangler", "dev"]

