FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

WORKDIR /app

COPY . .

RUN rm -rf node_modules dist

RUN pnpm install --frozen-lockfile --prod=false --ignore-scripts \
    && pnpm rebuild esbuild vue-demi

RUN pnpm build

FROM nginx:alpine AS production

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

