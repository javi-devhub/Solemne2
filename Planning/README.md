

---

# Planificación semanal del equipo

## Semana 1: Definición y organización inicial

| Día              | Actividad planificada                                                                                                                      | Estado |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| Lunes 27 de abril  | Definir la idea principal del juego, el contexto narrativo, el tipo de terror psicológico y la mecánica cooperativa base.                  | ✔    |
| Martes 28 de abril | Establecer los requisitos del proyecto mediante MoSCoW, definiendo funcionalidades obligatorias, deseables, opcionales y fuera de alcance. | X      |
| Jueves 30 de abril | Definir la tecnología a utilizar, la estructura general del proyecto, mockup de las pantallas principales y además la organización inicial del repositorio. | ✔      |

---

## Semana 2: Diseño de experiencia, escenas y puzzles

| Día               | Actividad planificada                                                                                                                           | Estado |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Lunes 4 de mayo  | Diseñar y realizar un brainstorming de una posible primera escena jugable, incluyendo ambiente, objetos inspeccionables, pistas y objetivo principal de la habitación.                  | ✔       |
| Martes 5 de mayo | Diseñar y realizar un brainstorming de posibles puzzles cooperativos, considerando percepción distinta entre jugadores, pistas compartidas y condiciones de resolución. | ✔      |
| Jueves 7 de mayo | Elaborar mockups del HUD, panel de pistas y más eventos de tensión como glitches o screamers.                 | ✔      |

---

## Semana 3: Desarrollo base del prototipo

| Día               | Actividad planificada                                                                                                              | Estado |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Lunes 11 de mayo  | Implementar y testear la base visual del juego, incluyendo pantalla de inicio, pantalla principal y estructura dividida para dos jugadores.  |  ✔     |
| Martes 12 de mayo | Implementar y testear elementos básicos de gameplay, como movimiento, HUD, inventario, objetos inspeccionables y mensajes de interacción.    | ✔      |
| Jueves 14 de mayo | Integrar y testear la lógica cooperativa, incorporando pistas diferentes para cada jugador, condiciones de avance y primer puzzle funcional. | ✔      |

---

## Semana 4: Eventos, pruebas y ajustes

| Día               | Actividad planificada                                                                                                                     | Estado |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Lunes 18 de mayo  | Implementar y testear eventos de tensión, como screamer, glitch visual o aparición de la presencia, además de consecuencias por errores.            | ✔      |
| Martes 19 de mayo | Realizar pruebas del flujo completo del juego, revisar errores, ajustar mecánicas y validar puzzles, inventario y visibilidad de objetos. | ✔      |
| Jueves 21 de mayo | Realizar testeos generales del juego completo, revisando pantallas, movimiento, HUD, inventario, objetos inspeccionables, interacción, puzzles, eventos de tensión, visibilidad diferenciada entre jugadores y flujo general del prototipo. | ✔ |
---

## Semana 5: Revisión y entrega final

| Día               | Actividad planificada                                                                                                                             | Estado |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Jueves 28 de mayo | Completar documentación, revisar README y DESIGN, verificar repositorio, Dockerfile, pipeline CI/CD, build final y realizar entrega del proyecto. | ✔      |

---

**Observación:** La priorización MoSCoW fue trabajada como parte de la planificación inicial del proyecto, pero no fue implementada directamente dentro del prototipo. El desarrollo se concentró en concretar las mecánicas principales del juego, como movimiento, inventario, interacción con objetos, mensajes y el primer puzzle cooperativo.


# PLANNING.md — Solemne 3

## Semana 1

| Día          | Actividad planificada                                                                                                                                                                                                                                                                 | Estado |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Lunes 15/06  | Desarrollar la segunda parte del `PLANNING.md` y subirla al repositorio, dividir el proyecto en frontend y backend, actualizar el `DESIGN.md`, definir la ruta del juego, definir para qué se utilizarán los modelos de datos y establecer las mejoras que se realizarán en el juego. | ✔      |
| Martes 16/06 | Crear la estructura base del backend e implementar los endpoints iniciales para el registro y login de usuarios.                                                                                                                                                                      | ✔      |
| Jueves 18/06 | Conectar el backend con MongoDB, crear el modelo de usuario y comprobar el funcionamiento del registro y login. Confirmar la integración de OpenWeatherMap y documentar en `DESIGN.md` el endpoint consumido y su funcionalidad dentro del juego.                                     | ✔      |

## Semana 2

| Día          | Actividad planificada                                                                                                                                                                                                                                                               | Estado |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Lunes 22/06  | Integrar el registro y login con el frontend del juego. Agregar una pantalla de instrucciones con los controles y la mecánica cooperativa. Crear los `Dockerfile` base para frontend y backend.                                                                                     | ✔     |
| Martes 23/06 | Crear el modelo y los endpoints para guardar y recuperar el progreso de la partida. Mejorar las hitbox y las zonas de interacción de los objetos del mapa. Crear un `compose.yml` que levante los tres servicios —frontend, backend y MongoDB— y verificar que funcione localmente. | ✔      |
| Jueves 25/06 | Conectar el guardado de progreso con el juego y mejorar el sistema de screamers. Implementar pruebas unitarias del backend, al menos para autenticación y endpoints de progreso.                                                                                                    | ✔       |

## Semana 3

| Día          | Actividad planificada                                                                                                                                                                                                                                                                           | Estado |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Lunes 29/06  | Implementar el segundo puzzle cooperativo, incluyendo objetos interactivos, acciones de ambos jugadores, validación y apertura de zona. Integrar el servicio REST externo en el juego e implementar pruebas unitarias del frontend.                                                             | ☐      |
| Martes 30/06 | Probar y corregir el puzzle, la integración del servicio externo y las mejoras generales del juego. Ajustar los `Dockerfile` y el `compose.yml` para la versión final. Comenzar la configuración del workflow de GitHub Actions.                                                                | ☐      |
| Jueves 02/07 | Finalizar y verificar el workflow de GitHub Actions, incluyendo linter, pruebas, build y push a DockerHub. Completar el `README.md` con instrucciones de ejecución local, Docker Compose y enlaces a DockerHub. Realizar la revisión final de la integración entre frontend, backend y MongoDB. | ☐      |
