FROM oven/bun as base
RUN apt update -y && apt install -y \
  chromium \
  software-properties-common
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
WORKDIR /usr/src/app
COPY ./package*.json ./
COPY ./bun.lockb ./

RUN apt remove -qy --purge software-properties-common \
  && apt autoclean -qy \
  && apt autoremove -qy --purge \
  && apt clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /.cache/*

FROM base as production
ENV NODE_ENV=production
RUN bun install --omit=dev
COPY . .
CMD ["bun", "start"]

FROM base as dev
ENV NODE_ENV=development
RUN bun install
COPY . .
CMD ["bun", "run", "dev"]
