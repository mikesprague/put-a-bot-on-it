FROM node:24-bookworm-slim AS base
RUN npm install --location=global npm bun
WORKDIR /usr/src/app
COPY ./package.json ./
COPY ./bun.lock ./

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
