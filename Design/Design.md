# Descripción del juego.

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

# Especificaciones tecnológicas.

Utilizaremos Vue ya que permitirá organizar el proyecto mediante componentes reutilizables, manejar pantallas del juego y actualizar visualmente la interfaz cuando cambie el estado de los jugadores.

Phaser ya que incluye herramientas para el sistema de físicas, animaciones, posición de objetos, cambios de escena, etc.

Pinia ya que es un gestor de Vue, es un store (lugar donde se guarda el estado del juego)

TypeScript ya que ayuda a escribir el juego de forma más ordenada.

Vite ayudará a levantar el servidor de desarrollo y hacer un hot reload (cambios al instante)

Vue Router ayudará a la fluidez de la web en la que estará desarrollado el juego como por ejemplo: la selección de interfaces.

# Mockups.

<img src="https://drive.google.com/file/d/1lpNhaNeD--VDxzSkbIT0dzp3R81_CoCu/view?usp=drive_link" width="500" alt="Mockups Inicio, inventario y posible screamer.">
