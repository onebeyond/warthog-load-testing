FROM node:18-alpine3.17 AS test-build

RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -
RUN mv /root/.local/share/pnpm/pnpm /usr/bin/

WORKDIR /usr/src/app

COPY .npmrc .
COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm fetch
RUN pnpm install -r --offline --ignore-pnpmfile --prod

COPY index.js index.js
COPY src/ src/
COPY examples/redis.js examples/redis.js

ARG SCRIPT_PARALLELISM
ENV SCRIPT_PARALLELISM=$SCRIPT_PARALLELISM

ARG SCRIPT_ITERATIONS
ENV SCRIPT_ITERATIONS=$SCRIPT_ITERATIONS

ARG WARTHOG_TESTS_PATH
ENV WARTHOG_TESTS_PATH=$WARTHOG_TESTS_PATH

ARG WARTHOG_DURATION
ENV WARTHOG_DURATION=$WARTHOG_DURATION

ARG REDIS_HOST
ENV REDIS_HOST=$REDIS_HOST

CMD ["tail", "-f", "/dev/null"]
