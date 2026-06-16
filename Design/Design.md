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

```proyecto-juego/
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
│   │   │   ├── GameCanvas.vue
│   │   │   ├── PlayerHUD.vue
│   │   │   ├── InventoryBar.vue
│   │   │   ├── CluePanel.vue
│   │   │   ├── InteractionPrompt.vue
│   │   │   └── ScreamerOverlay.vue
│   │   │
│   │   └── ui/
│   │       ├── BaseButton.vue
│   │       ├── BaseModal.vue
│   │       └── DialogBox.vue
│   │
│   ├── views/
│   │   ├── HomeView.vue
│   │   ├── GameView.vue
│   │   ├── PauseView.vue
│   │   ├── VictoryView.vue
│   │   └── DefeatView.vue
│   │
│   ├── game/
│   │   ├── phaserConfig.ts
│   │   ├── mainGame.ts
│   │   │
│   │   ├── scenes/
│   │   │   ├── Scene1.ts
│   │   │   ├── Scene2.ts
│   │   │   ├── Scene3.ts
│   │   │   ├── Scene4.ts
│   │   │   └── Scene5.ts
│   │   │
│   │   ├── objects/
│   │   │   ├── Player.ts
│   │   │   ├── InteractiveObject.ts
│   │   │   ├── Door.ts
│   │   │   └── Entity.ts
│   │   │
│   │   ├── systems/
│   │   │   ├── MovementSystem.ts
│   │   │   ├── InteractionSystem.ts
│   │   │   ├── PuzzleSystem.ts
│   │   │   ├── VisibilitySystem.ts
│   │   │   └── EventSystem.ts
│   │   │
│   │   └── data/
│   │       ├── rooms.ts
│   │       ├── items.ts
│   │       ├── clues.ts
│   │       └── puzzles.ts
│   │
│   ├── stores/
│   │   ├── gameStore.ts
│   │   ├── playerStore.ts
│   │   ├── inventoryStore.ts
│   │   └── puzzleStore.ts
│   │
│   ├── router/
│   │   └── index.ts
│   │
│   ├── types/
│   │   ├── player.ts
│   │   ├── item.ts
│   │   ├── room.ts
│   │   ├── clue.ts
│   │   └── puzzle.ts
│   │
│   ├── tests/
│   │   ├── puzzles.test.ts
│   │   ├── inventory.test.ts
│   │   └── visibility.test.ts
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

```

# Mockups.

![Mockup inicio, inventario y posible screamer](https://lh3.googleusercontent.com/d/1eV0t0Bjh2wN9D6DtZhWSACHebE7WU1uP)

# Solemne 3

## Mejoras y correcciones respecto a la Solemne 2

| Área           | Problema detectado                                                                       | Corrección aplicada                                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cooperatividad | La mecánica cooperativa era poco dinámica y no exigía interacción física entre jugadores | Se agregará un segundo puzzle que requerirá que ambos jugadores combinen información distinta y realicen acciones complementarias para poder avanzar |
| Screamers      | Aparecían con demasiada frecuencia y de forma aleatoria, rompiendo la experiencia        | Los screamers se activarán únicamente durante la resolución de puzzles, con una probabilidad controlada y un cooldown mínimo entre apariciones       |
| Instrucciones  | No existía ninguna pantalla de instrucciones; los controles no eran evidentes            | Se agregará una pantalla de instrucciones al inicio del juego con los controles de ambos jugadores y la explicación de la mecánica cooperativa       |
| Hitbox         | Las zonas de interacción de los objetos del mapa eran imprecisas                         | Se redefinirán los colliders y zonas de interacción de todos los objetos interactivos del mapa                                                       |

## Nuevas mecánicas y pantallas

### Pantalla de instrucciones

Se implementará una pantalla accesible antes de iniciar la partida. Mostrará los controles del Jugador 1 (WASD + E/Q) y del Jugador 2 (flechas + P/ENTER/BACKSPACE), y explicará brevemente la mecánica de percepción diferenciada entre jugadores.

### Segundo puzzle cooperativo

Se desarrollará un nuevo puzzle llamado **"Las marcas en la pared"**, ubicado en la segunda habitación o pasillo cerrado. El objetivo es descubrir el código correcto para desbloquear una puerta o panel.

Ambas jugadoras verán la misma pared, pero con información distinta y complementaria:

* **Jugadora 1 — La que recuerda:** verá la pared con dibujos emocionales (una casa, un osito y una puerta) resaltados con un círculo luminoso. Podrá identificar el orden visual de los símbolos de izquierda a derecha: Casa → Osito → Puerta.
* **Jugadora 2 — La que olvida:** verá la misma pared con una superposición técnica similar a una cuadrícula de medición. No verá los símbolos con claridad, pero sí verá números asociados a las posiciones: posición #1 = 4, posición #2 = 1, posición #3 = 7.

Cada jugadora tendrá la mitad de la información. La Jugadora 1 conoce el orden de los símbolos, pero no los números. La Jugadora 2 conoce los números, pero no a qué símbolo corresponde cada posición.

Para resolver el puzzle deberán comunicarse verbalmente: la Jugadora 1 dicta el orden (Casa, Osito, Puerta) y la Jugadora 2 traduce cada símbolo a su número (4, 1, 7). Al combinar ambas interpretaciones descubrirán el código **417**, que deberán ingresar en el panel para desbloquear la salida.

### Sistema de screamers controlado

Los screamers dejarán de ser aleatorios. Se implementará un sistema de presión durante el segundo puzzle cooperativo, **"Las marcas en la pared"**, basado en dos disparadores:

* **Por tiempo:** si las jugadoras se demoran demasiado en resolver el puzzle, aparecerá una sombra en el borde de la pantalla que comenzará a caminar lentamente hacia ellas. Mientras más tiempo pase sin resolver el puzzle, más se acercará. Si la sombra llega hasta las jugadoras, se activará el screamer.
* **Por errores:** si las jugadoras ingresan un código incorrecto en el panel, la sombra avanzará un tramo fijo como penalización, acelerando la llegada del screamer.

Una vez resuelto el puzzle, la sombra desaparece. Este sistema reemplaza la aparición aleatoria y entrega a las jugadoras señales visuales claras de la presión acumulada, haciendo que el susto sea narrativamente coherente y menos abusivo.

### Pantallas de autenticación

* **Registro:** formulario con nombre de usuario, correo y contraseña.
* **Login:** formulario con correo y contraseña. Generará un token JWT que se almacenará en el cliente.
* **Sesión persistente:** el token JWT se almacenará temporalmente en `localStorage` y se enviará en las solicitudes autenticadas al backend. Al cerrar sesión, el token será eliminado.

### Guardado y recuperación de progreso

El progreso de la partida, incluyendo la zona actual, los puzzles completados y el inventario, se guardará en MongoDB asociado al usuario autenticado.

Al iniciar sesión, el juego ofrecerá continuar desde el último punto guardado.

## Arquitectura fullstack

```text
┌─────────────────────┐        ┌──────────────────────┐        ┌─────────────┐
│     Frontend        │  HTTP  │      Backend         │Mongoose│   MongoDB   │
│  Vue 3 + Phaser     │◄──────►│  Node.js + Express   │◄──────►│             │
│  TypeScript + Pinia │        │  API REST + JWT      │        │             │
└─────────────────────┘        └──────────┬───────────┘        └─────────────┘
                                         │ HTTP REST
                                         ▼
                              ┌──────────────────────┐
                              │ OpenWeatherMap API   │
                              │ servicio externo     │
                              └──────────────────────┘
```

### Nuevas tecnologías del backend

| Categoría        | Dependencia        | Propósito                                                              |
| ---------------- | ------------------ | ---------------------------------------------------------------------- |
| Runtime backend  | Node.js + Express  | Servidor HTTP que expone la API REST                                   |
| Base de datos    | MongoDB + Mongoose | Persistencia de usuarios y progreso de partidas                        |
| Autenticación    | JWT + bcrypt       | Generación de tokens y hash seguro de contraseñas                      |
| Servicio externo | OpenWeatherMap API | Obtención del clima real para aplicar efectos de atmósfera en el juego |
| Testing backend  | Jest               | Pruebas unitarias de los endpoints y lógica del servidor               |

### Modelo de datos

#### Usuario (`users`)

```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "passwordHash": "string",
  "createdAt": "Date"
}
```

#### Progreso de partida (`progress`)

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "currentZone": "string",
  "completedPuzzles": ["string"],
  "inventory": {
    "player1": ["string"],
    "player2": ["string"]
  },
  "updatedAt": "Date"
}
```

### Endpoints de la API REST

La columna **Auth** indica si el endpoint necesita autenticación. Los endpoints marcados como `JWT` requieren enviar el token mediante el encabezado:

```text
Authorization: Bearer <token>
```

#### Autenticación

| Método | Endpoint             | Descripción                                                 | Auth |
| ------ | -------------------- | ----------------------------------------------------------- | ---- |
| POST   | `/api/auth/register` | Registro de nuevo usuario                                   | No   |
| POST   | `/api/auth/login`    | Login, retorna JWT                                          | No   |
| GET    | `/api/auth/me`       | Obtiene los datos del usuario autenticado mediante su token | JWT  |

#### Progreso

| Método | Endpoint        | Descripción                                                     | Auth |
| ------ | --------------- | --------------------------------------------------------------- | ---- |
| GET    | `/api/progress` | Obtiene el progreso del usuario autenticado                     | JWT  |
| POST   | `/api/progress` | Crea o actualiza el progreso de la partida                      | JWT  |
| DELETE | `/api/progress` | Elimina el progreso del usuario para comenzar una nueva partida | JWT  |

#### Clima

| Método | Endpoint       | Descripción                                     | Auth |
| ------ | -------------- | ----------------------------------------------- | ---- |
| GET    | `/api/weather` | Retorna el clima actual procesado para el juego | No   |

### Organización de carpetas 

```text
proyecto-juego/
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── progress.ts
│   │   │   └── weather.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── progressController.ts
│   │   │   └── weatherController.ts
│   │   │
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Progress.ts
│   │   │
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts
│   │   │
│   │   ├── tests/
│   │   │   ├── auth.test.ts
│   │   │   └── progress.test.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── Dockerfile
│   └── package.json
│
└── compose.yml
```
# Flujo general del juego

Pantalla inicial
↓
Registro o login
↓
Menú principal
↓
Nueva partida o continuar partida
↓
Pantalla de instrucciones (solo al iniciar una nueva partida)
↓
Gameplay
↓
Primer puzzle
↓
Segundo puzzle cooperativo
↓
Pantalla de cierre o mensaje de “Continuará”


## Integración con servicio REST externo

### Servicio: OpenWeatherMap API

* **URL base:** `https://api.openweathermap.org/data/2.5/weather`
* **Plan:** gratuito.
* **Documentación:** `https://openweathermap.org/current`

### Endpoint consumido

```text
GET https://api.openweathermap.org/data/2.5/weather?q=Bergen,NO&appid={API_KEY}&units=metric
```

La API key se almacenará como variable de entorno en el backend mediante el archivo `.env` y nunca será expuesta al frontend.

El consumo se realizará exclusivamente desde el backend para proteger la clave y evitar posibles problemas de CORS.

### Ciudad por defecto: Bergen, Noruega

Bergen es una ciudad reconocida por su clima lluvioso, sus pocas horas de luz durante el invierno.

Esta elección refuerza la atmósfera de terror psicológico y desorientación del juego.

### Transformación de la respuesta

El backend procesará la respuesta de OpenWeatherMap y la transformará en un objeto de atmósfera:

```json
{
  "condition": "rain",
  "temperature": -4,
  "isNight": true
}
```

Los valores posibles para `condition` serán:

```text
rain | thunderstorm | mist
```

### Efectos en el juego

| Condición meteorológica | Efecto en el juego                                                                                                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rain`                  | Sonido ambiental de lluvia                                                                                                                                                       |
| `thunderstorm`          | Parpadeos de luz y sonido de truenos.|
| `mist` / `fog`          | Reducción del campo de visión de ambos jugadores                                                                                                                                 |
| Otras condiciones       | Ambiente normal sin modificaciones adicionales                                                                                                                                   |
