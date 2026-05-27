FROM node:22-alpine AS deps

# corepack viene incluido en node:20, activa pnpm sin npm install -g
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar SOLO los manifiestos primero para aprovechar el cache de capas.
# Si no cambian package.json ni pnpm-lock.yaml, Docker reutiliza esta
# capa en builds posteriores y se salta el pnpm install completo.
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --ignore-scripts \
    && pnpm rebuild esbuild vue-demi
# ── Etapa 2: Build ────────────────────────────────────────────
FROM deps AS builder

# Copiar el código fuente (node_modules ya está en la capa anterior)
COPY . .

# vue-tsc verifica tipos, vite empaqueta y copia /public al /dist
RUN pnpm build

# ── Etapa 3: Producción ───────────────────────────────────────
# nginx:alpine pesa ~45 MB y no incluye node_modules ni código fuente
FROM nginx:alpine AS production

# Eliminar la página de bienvenida por defecto de nginx
RUN rm -rf /usr/share/nginx/html/*

# Traer solo el resultado del build — todo lo demás se descarta
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración para SPA: redirige rutas desconocidas a index.html
# (necesario para que Vue Router funcione al recargar la página)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
