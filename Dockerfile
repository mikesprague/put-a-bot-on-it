FROM oven/bun:1.3-slim AS base
WORKDIR /usr/src/app
COPY ./package.json ./
COPY ./bun.lock ./
COPY ./bunfig.toml ./
COPY ./env.schema ./
COPY ./env.d.ts ./

FROM base AS production
ENV NODE_ENV=production
RUN bun install --no-save
COPY . .
CMD ["bun", "start"]

FROM base AS dev
ENV NODE_ENV=development
RUN bun install
COPY . .
CMD ["bun", "run", "dev"]
