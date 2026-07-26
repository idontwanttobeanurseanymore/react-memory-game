# 🃏 Mirror Rush - Encontrar Parejas de Cartas

Imagina este proyecto como una **máquina recreativa arcade** de juego de memoria visual de buscar parejas de cartas en tableros de distintas dificultades.

El objetivo del jugador es voltear cartas de dos en dos hasta **encontrar todas las parejas** del tablero en la menor cantidad de movimientos y en el menor tiempo posible, y competir por entrar en la tabla de **mejores puntuaciones**.

**Te recomiendo que pruebes el proyecto, ¡te enganchará!**

🔗 https://martamao-memory-game.onrender.com/

¿Serás capaz de encontrar todas las parejas en el menor tiempo posible y clasificarte en el **TOP 5**?

---

## ✨ Funcionalidades y Características Principales

La aplicación ha sido desarrollada con un **diseño responsive** para poder disfrutar del juego en cualquier pantalla y un **diseño retro** con el objetivo de hacer un guiño a los años 90, etapa en la que está inspirada la aplicación y buscando una estética más personal y divertida.

### **🚀 Pantalla de Inicio**

- **Identificación** del Jugador: Introduces 3 letras (ejemplo: MRT) que serán tu nombre de usuario. Identificación con usuario y contraseña en desarrollo para mejorar el sistema de ranking y la seguridad general de la aplicación.
- **⚡ Niveles**
  - 🟢 Easy (Fácil): Tablero 4x4 (8 parejas de emoticonos).
  - 🟡 Medium (Medio): Tablero 4x4 (12 parejas temáticas).
  - 🔴 Hard (Difícil): Tablero 6x6 (18 parejas).
  - 🟣 Expert (Experto): Tablero 6x6 (18 parejas de mayor dificultad visual).
- **🏆 Leaderboard**: Permite ver las mejores puntuaciones de todos los niveles sin necesidad de jugar una partida.

### **🃏 Tablero** (Memory Board)

- Muestra tus **movimientos** (cada intento de 2 cartas) y un **cronómetro** en segundos.
- Interacción: Haces clic en una carta para destaparla y luego en otra. Si coinciden, se quedan fijas; si fallas, se vuelven a ocultar tras 1 segundo.
- **Finalización de la partida**:
  - Ganar: Encuentras todas las parejas.
  - Perder (Tiempo agotado): Si el cronómetro llega a 3 minutos (180 segundos), la partida termina como perdida. Las partidas perdidas no se guardan en el ranking.
- **Pantalla de Rankings**:
  - Vista Individual (SHOW MY RANKING): Muestra el resumen de tu última partida jugada y la tabla con los 5 mejores jugadores de ese nivel concreto.
  - Vista Global (SHOW ALL): Muestra de un vistazo las tablas del Top 5 de todos los niveles.
- **Rejugabilidad** (PLAY AGAIN / CHOOSE LEVEL): Botones para volver a jugar inmediatamente al mismo nivel con las cartas rebarajadas o volver al inicio para cambiar de nivel o jugador.

### **Modo Sin Conexión** (Offline Support)

- Si la base de datos falla, el juego sigue funcionando guardando tus resultados en la memoria de tu propio navegador (LocalStorage). En cuanto vuelvas a tener conexión, las partidas pendientes se suben solas.

---

## 🚀 Tecnologías utilizadas

- **React 19**: Interfaz moderna basada en componentes funcionales.
- **Vite 8**: Desarrollo y construcción ultra-rápida.
- **SASS (SCSS)**: Estilos modulares y avanzados.
- **JavaScript (ES6+)**: Lógica del juego y gestión de estado.
- **AI Agents**: **Gemini CLI**, **Copilot CLI** y **Codex**
- **Aiven**: base de datos MySQL
- **Render**: servidor Express.

---

## 🎮 Reglas del juego:

1. **Inicio**: Escribe tu nombre de usuario en la página principal para comenzar.
2. **El Reto**: Voltea 2 cartas por turno. Si coinciden, permanecen visibles; si no, se ocultan tras un breve instante.
3. **El Tiempo**: El cronómetro comienza en cuanto entras al tablero. ¡Sé rápido, tienes 3 minutos!
4. **Victoria**: El juego termina cuando encuentras todas las parejas.
5. **Ranking**: Al ganar, podrás ver tu puntuación y comprobar si has entrado en el Top 5 basándote en el número de movimientos y el tiempo empleado.

---

## 📦 Estructura del proyecto

El código está organizado de forma modular para facilitar su mantenimiento y escalabilidad:

```text
src/
├── components/          # Componentes de la interfaz
│   ├── Button.jsx       # Botones interactivos retro
│   ├── Card.jsx         # Lógica visual de cada carta
│   ├── Counter.jsx      # Panel de movimientos, puntos y tiempo
│   ├── LandingPage.jsx  # Pantalla de bienvenida y registro
│   ├── Message.jsx      # Mensajes de feedback (Victoria/Derrota)
│   └── Ranking.jsx      # Tabla de puntuaciones persistente
├── hooks/               # Lógica de negocio desacoplada
│   └── useMemoryGame.js # Hook principal que gestiona el estado del juego
├── styles/              # Estilos modulares (SASS)
│   └── [Component].scss # Estilos específicos por componente
├── App.jsx              # Orquestador principal de vistas
├── App.scss             # Estilos globales y layouts
├── constants.js         # Configuraciones y datos estáticos
└── main.jsx             # Punto de entrada de la aplicación
```

---

## ⚡ Instalación

1. Clona el repositorio.
2. Instala las dependencias: `npm install`
3. Arranca el servidor: `npm run dev`
4. Arranca el proyecto:
   ```
   cd frontend
   npm i
   npm run dev
   ```

---

## 🔮 Futuras funcionalidades

- **Autenticación**
- **Sonidos**: Efectos de sonido retro para mejorar la inmersión.

---

## 🤖 Desarrollo Asistido por IA

Este proyecto ha sido desarrollado con la ayuda de **Gemini CLI**, **Copilot CLI** y **Codex**. Gracias a la colaboración entre programadora y asistente, el flujo de trabajo es dinámico y eficiente:

- **Metodología OpenSpec**: Cada cambio se planifica, diseña y ejecuta siguiendo especificaciones estrictas para garantizar la calidad.
- **Pair Programming**: La IA no solo genera código, sino que asiste en la arquitectura, refactorización y resolución de bugs complejos en tiempo real.

---

## 🏗️ Estado del proyecto y Agradecimientos

Este proyecto es un "work in progress" constante. Se aceptan comentarios, sugerencias y PRs.

**Agradecimientos:**

- A **Iván**, mi profesor, por su guía y su infinita curiosidad.
- A **Adalab**, por "conectarme" con mis compañeras de Bootcamp y por abrirme las puertas del mundo tech.
- A las **IA**, por ser las mejores compañeras de código.
- A toda la comunidad **OpenSource** por las herramientas que hacen esto posible.

---

---

_Si has tenido que mirar en Google el significado de alguna cosa, tranquila, no eres la única. Lo "breve, conciso y preciso" no van de la mano de "que lo entiendan también los juniors"._

**Desarrollado con ❤️ y mucha paciencia**

_¡Gracias por leer hasta el final!_
