## Descripción
Videojuego cooperativo 2D de terror psicológico para 2 jugadores.  
Cada jugador percibe elementos distintos del entorno, lo que exige comunicación constante para explorar, resolver puzles y avanzar.  
El foco está en exploración, percepción alterada y tensión psicológica más allá de simples sustos.

## Gameplay
- Introducción narrativa  
- Exploración y descubrimiento de pistas  
- Comunicación cooperativa  
- Resolución de puzles  
- Eventos aleatorios (recompensas o screamers)  
- Escalada de dificultad hasta el desenlace final  

## Tecnologías
- **Frontend:** Vue.js 3, Pinia (State Management), Vite, Vue Router  
- **Game Engine:** Phaser  
- **Language:** TypeScript  
- **Testing:** Vitest, Vue Test Utils  
- **Linter:** ESLint & Prettier  
- **Package Manager:** pnpm  
- **Containerization:** Docker  
- **3CI/CD:** GitHub Actions  

## Instalación y ejecución del proyecto

### Requisitos previos

Antes de ejecutar el proyecto, se debe tener instalado:

* Node.js 22 o superior
* pnpm
* Docker Desktop, solo si se desea ejecutar el proyecto mediante contenedor

---

### Instalación de dependencias

Desde la raíz del repositorio, entrar a la carpeta del juego:

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

### Generar build de producción

Para compilar el proyecto:

```bash
pnpm build
```

---


## Ejecución con Docker

El proyecto también puede ejecutarse mediante Docker.

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

