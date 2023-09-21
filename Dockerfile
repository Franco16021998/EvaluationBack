FROM node:18.17-alpine
RUN addgroup -S nest && adduser -S nest -G nest
USER nest:nest
WORKDIR /usr/src/app
COPY --chown=nest:nest package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD [ "node", "dist/main.js" ]