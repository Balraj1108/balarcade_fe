FROM node:20-alpine as builder
ARG ENV
WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN npm install -g @angular/cli

COPY . .

RUN if [[ "$ENV" = "prod" ]]; then \
      npm run build -- --configuration production; \
    elif [[ "$ENV" = "dev" ]]; then \
      npm run build -- --configuration development; \
    else \
      npm run build; \
    fi

FROM nginx:latest
COPY ./nginx.conf  /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/balarcade_fe/browser /usr/share/nginx/html
EXPOSE 80
