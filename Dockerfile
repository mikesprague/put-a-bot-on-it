FROM node:22-bookworm-slim as base
RUN npm install --location=global npm bun
WORKDIR /usr/src/app
COPY ./package.json ./
COPY ./bun.lock ./

FROM base as production
ENV NODE_ENV=production
RUN bun install --no-save
COPY . .
CMD ["bun", "start"]

FROM base as dev
ENV NODE_ENV=development
RUN bun install
COPY . .
CMD ["bun", "run", "dev"]
