# Nombre del Juego

Videojuego cooperativo 2D de terror psicológico para 2 jugadores.

## Stack tecnológico

| Herramienta | Uso |
|---|---|
| Vue 3 + Vite | Framework frontend |
| Phaser 3 | Motor de juego 2D |
| TypeScript | Lenguaje |
| Pinia | Estado global |
| Vue Router | Navegación |
| Vitest | Testing |
| pnpm | Gestor de paquetes |
| Docker | Contenedores |
| GitHub Actions | CI/CD |

## Inicio rápido

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Comandos

```bash
pnpm dev        # Servidor de desarrollo
pnpm build      # Build de producción
pnpm test       # Tests con Vitest
pnpm lint       # ESLint
pnpm format     # Prettier
```

## Docker

```bash
docker build --target dev -t horror-game-dev .
docker run -p 3000:3000 horror-game-dev
```

## Controles

| Jugador 1 | Jugador 2 |
|---|---|
| WASD → Movimiento | ↑↓←→ → Movimiento |
| E → Interactuar | Enter → Interactuar |
| ESC → Pausa | ESC → Pausa |
