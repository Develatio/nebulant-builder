FROM node:22-slim

RUN apt update && apt install -y curl openssl jq

WORKDIR /code

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /key.pem -out /cert.pem \
    -subj "/C=ES/ST=CyL/L=Valladolid/O=Develatio SL/OU=Development/CN=nebulant.lc/emailAddress=root@nebulant.lc" \
    -passout pass:
COPY docker/entrypoint.sh /entrypoint.sh
COPY packages/ /code/packages
COPY src/ /code/src
COPY public/ /code/public
COPY .env .env.production .env.staging biome.json esbuild.mjs \
     jsconfig.json package.json yarn.lock /code/

RUN cd /code && corepack enable && yarn set version berry
RUN yarn config set nodeLinker node-modules && yarn install && npx update-browserslist-db@latest

ENTRYPOINT ["/entrypoint.sh"]
CMD ["run-esbuild"]
