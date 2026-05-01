# Descripción del juego

Consiste en un videojuego cooperativo 2D de terror psicológico, pensado para 2 jugadores, donde ambos deben explorar habitaciones, inspeccionar objetos y resolver puzzles para avanzar.

La mecánica principal es que cada jugador ve elementos distintos del entorno, por lo que deben comunicarse constantemente para entender qué está pasando y poder resolver los desafíos.

La idea central es que el juego no dependa solo de sustos, sino también de:

- Exploración.
- Comunicación entre los 2 jugadores.
- Puzles cooperativos.
- Percepción alterada.
- Terror psicológico.
- Fragmentos de recuerdos o traumas.
- Eventos aleatorios como recompensas o screamers.

Flujo del juego.
- Pantalla inicial.
- Introducción narrativa.
- Inicio del gameplay.
- Descubrimiento de pistas.
- Comunicación cooperativa.
- Resolución de puzles.
- Evento RNG.
- Progreso a siguiente área.
- Escalada de tensión (aumento de dificultad)
- Último puzle.
- Final.

# Especificaciones tecnológicas

| Categoría             | Dependencias / herramientas | Propósito                                                                                                                                                                      |
| --------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Framework frontend    | Vue 3                       | Permitirá organizar el proyecto mediante componentes reutilizables, manejar pantallas del juego y actualizar visualmente la interfaz cuando cambie el estado de los jugadores. |
| Entorno de desarrollo | Vite                        | Ayudará a levantar el servidor de desarrollo y realizar hot reload, es decir, cambios al instante durante el desarrollo.                                                       |
| Motor de juego 2D     | Phaser                      | Incluye herramientas para el sistema de físicas, animaciones, posición de objetos, cambios de escena y lógica visual del juego.                                                |
| Lenguaje              | TypeScript                  | Ayuda a escribir el juego de forma más ordenada y con mejor control de errores.                                                                                                |
| Estado global         | Pinia                       | Gestor de estado de Vue. Se utilizará como store para guardar el estado general del juego.                                                                                     |
| Navegación            | Vue Router                  | Permitirá cambiar entre pantallas del juego, como inicio, gameplay, pausa, victoria y derrota.                                                                                 |
| Testing               | Vitest y Vue Test Utils     | Además de estar basado en Vite, permitirá realizar testing compatible con los proyectos Vue.                                                                                   |
| Calidad de código     | ESLint y Prettier           | Permitirán revisar, formatear y mantener la consistencia del código.                                                                                                           |
| Gestor de paquetes    | pnpm                        | Permitirá instalar y administrar las dependencias del proyecto.                                                                                                                |
| Contenedores          | Docker                      | Permitirá ejecutar el proyecto en un entorno controlado.                                                                                                                       |
| Automatización        | GitHub Actions              | Permitirá ejecutar pruebas y build automático del proyecto.                                                                                                                    |
# Organización de las carpetas

```nombre-del-juego/
│
├── public/
│   └── assets/
│       ├── images/
│       ├── audio/
│       └── fonts/
│
├── src/
│   ├── assets/
│   │   ├── sprites/
│   │   ├── backgrounds/
│   │   ├── sounds/
│   │   └── ui/
│   │
│   ├── components/
│   │   ├── game/
│   │   │   ├── PlayerPanel.vue
│   │   │   ├── InventoryBar.vue
│   │   │   ├── CluePanel.vue
│   │   │   ├── InteractionPrompt.vue
│   │   │   └── ScreamerOverlay.vue
│   │   │
│   │   ├── ui/
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseModal.vue
│   │   │   └── DialogBox.vue
│   │
│   ├── views/
│   │   ├── HomeView.vue
│   │   ├── GameView.vue
│   │   ├── PauseView.vue
│   │   ├── VictoryView.vue
│   │   └── DefeatView.vue
│   │
│   ├── scenes/
│   │   ├── Scene1.vue
│   │   ├── Scene2.vue
│   │   └── Scene3.vue
│   │
│   ├── stores/
│   │   ├── gameStore.ts
│   │   ├── playerStore.ts
│   │   ├── inventoryStore.ts
│   │   └── puzzleStore.ts
│   │
│   ├── logic/
│   │   ├── movement.ts
│   │   ├── interactions.ts
│   │   ├── puzzles.ts
│   │   ├── rngEvents.ts
│   │   └── visibilityRules.ts
│   │
│   ├── data/
│   │   ├── rooms.ts
│   │   ├── items.ts
│   │   ├── clues.ts
│   │   ├── dialogues.ts
│   │   └── puzzles.ts
│   │
│   ├── router/
│   │   └── index.ts
│   │
│   ├── types/
│   │   ├── player.ts
│   │   ├── item.ts
│   │   ├── room.ts
│   │   └── puzzle.ts
│   │
│   ├── tests/
│   │   ├── puzzles.test.ts
│   │   ├── rngEvents.test.ts
│   │   └── visibilityRules.test.ts
│   │
│   ├── App.vue
│   └── main.ts
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── Dockerfile
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
├── tsconfig.json
├── README.md
└── DESIGN.md

# Mockups.

![Mockup inicio, inventario y posible screamer](https://lh3.googleusercontent.com/d/1lpNhaNeD--VDxzSkbIT0dzp3R81_CoCu)
