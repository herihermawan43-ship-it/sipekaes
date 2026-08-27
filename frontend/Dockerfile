FROM node:20-alpine AS build
WORKDIR /app

COPY package.json ./

# @emergentbase/visual-edits is an Emergent-platform-only dev tool (visual
# editor overlay for `craco start`). It isn't needed for a production build
# (`craco build` never requires it — see craco.config.js) and its install
# URL may not be reachable outside Emergent's own network, so drop it here
# rather than depend on that host during the Docker build.
RUN node -e "const p=require('./package.json'); delete p.devDependencies['@emergentbase/visual-edits']; require('fs').writeFileSync('./package.json', JSON.stringify(p, null, 2));"

RUN yarn install --legacy-peer-deps --network-timeout 300000

COPY . .

ARG REACT_APP_BACKEND_URL=""
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

RUN yarn build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
