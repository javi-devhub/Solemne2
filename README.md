## Descripci贸n
Videojuego cooperativo 2D de terror psicol贸gico para 2 jugadores.  
Cada jugador percibe elementos distintos del entorno, lo que exige comunicaci贸n constante para explorar, resolver puzles y avanzar.  
El foco est谩 en exploraci贸n, percepci贸n alterada y tensi贸n psicol贸gica m谩s all谩 de simples sustos.

## Gameplay
- Introducci贸n narrativa  
- Exploraci贸n y descubrimiento de pistas  
- Comunicaci贸n cooperativa  
- Resoluci贸n de puzles  
- Eventos aleatorios (recompensas o screamers)  
- Escalada de dificultad hasta el desenlace final  

## Tecnolog铆as
- **Frontend:** Vue.js 3, Pinia (State Management), Vite, Vue Router  
- **Game Engine:** Phaser  
- **Language:** TypeScript  
- **Testing:** Vitest, Vue Test Utils  
- **Linter:** ESLint & Prettier  
- **Package Manager:** pnpm  
- **Containerization:** Docker  
- **3CI/CD:** GitHub Actions  

## Instalaci髇 y ejecuci髇 del proyecto

### Requisitos previos

Antes de ejecutar el proyecto, se debe tener instalado:

* Node.js 22 o superior
* pnpm
* Docker Desktop, solo si se desea ejecutar el proyecto mediante contenedor

---

### Instalaci髇 de dependencias

Desde la ra韟 del repositorio, entrar a la carpeta del juego:

```bash
cd Shirokuro
```

Instalar las dependencias del proyecto:

```bash
pnpm install
```

---

### Ejecutar en modo desarrollo

Para iniciar el servidor de desarrollo:

```bash
pnpm dev
```

Luego abrir en el navegador:

```text
http://localhost:3000
```

---

### Generar build de producci髇

Para compilar el proyecto:

```bash
pnpm build
```

---


## Ejecuci髇 con Docker

El proyecto tambi閚 puede ejecutarse mediante Docker.

Desde la carpeta `Shirokuro`, construir la imagen:

```bash
docker build -t shirokuro .
```

Luego ejecutar el contenedor:

```bash
docker run -p 8080:80 shirokuro
```

Abrir en el navegador:

```text
http://localhost:8080
```

