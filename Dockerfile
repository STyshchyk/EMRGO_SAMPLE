# Dockerfile

ARG NGINX_VARIANT=alpine
ARG NODE_VARIANT=19-bullseye
# TARGET_APP_NAME values:
# client-authentication (default) | client-accounts | client-primaries | client-secondaries | internal-ui
ARG TARGET_APP_NAME="client-authentication"

# ---- Base ----
FROM node:$NODE_VARIANT as base
ARG TARGET_APP_NAME
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
# COPY ./apps apps/
COPY ./apps/$TARGET_APP_NAME apps/$TARGET_APP_NAME/
COPY ./packages packages/
COPY ./tools tools/
COPY .env .
COPY nx.json .
COPY tsconfig.base.json .

#
# ---- Dependencies ----
FROM base as dependencies
RUN npm ci

#
# ---- builder ----
FROM base as builder
ARG TARGET_APP_NAME
COPY --from=dependencies /usr/src/app/node_modules node_modules
RUN npm run build:$TARGET_APP_NAME

#
# ---- Release ----
FROM nginx:$NGINX_VARIANT as release
ARG CURRENT_MAINTAINER="Moncy Gopalan (moncy@wethaq.io)"
ARG GIT_COMMIT=unspecified
ARG GIT_SOURCE_BRANCH=unspecified
ARG TARGET_APP_NAME
LABEL maintainer=${CURRENT_MAINTAINER}
LABEL git_branch=${GIT_SOURCE_BRANCH}
LABEL git_commit=${GIT_COMMIT}
LABEL target_app_name=${TARGET_APP_NAME}
WORKDIR /usr/share/nginx/html/
COPY --from=builder /usr/src/app/dist/apps/$TARGET_APP_NAME ./
COPY ./nginx/*.conf /etc/nginx/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
