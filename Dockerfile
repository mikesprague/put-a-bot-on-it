FROM node:18-alpine as base
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont
RUN npm install --global npm --silent
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
WORKDIR /usr/src/app
COPY package*.json ./

FROM base as production
ENV NODE_ENV=production
RUN npm install --omit=dev --silent
COPY . .
CMD ["npm", "start"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]