# 🃏 Mirror Rush - Encontrar Parejas de Cartas

Este es mi primer proyecto utilizando **React**, como parte del contenido del Módulo 3 del Bootcamp en Desarrollo Web Full Stack.

El diseño y la estructura inicial del proyecto se basaron en una propuesta de **Adalab**, pero el diseño retro actual es una iniciativa propia, buscando una estética más personal y divertida. El backend se encuentra actualmente en desarrollo, pero estará disponible muy muy muy pronto.

Se trata de un juego clásico de encontrar parejas de cartas en tableros de distintas dificultades.

**Te recomiendo que pruebes el proyecto, ¡te enganchará!**

🔗 https://idontwanttobeanurseanymore.github.io/react-memory-game/

¿Serás capaz de encontrar todas las parejas en el menor tiempo posible y clasificarte en el **TOP 5**?

---

## ✨ Características Principales

- **🃏 Tablero**: El reto clásico de encontrar parejas.
- **⚡ Niveles**: Existen 4 niveles de dificultad.
- **📱 Diseño Responsive**: Experiencia optimizada para móviles y escritorio.
- **🎮 Estética Retro**: Inspirado en las consolas de 8 y 16 bits, con fuentes pixeladas y colores vibrantes.
- **🚀 Pantalla de Inicio**: Landing page personalizada con entrada de nombre de usuario.
- **🏆 Sistema de Ranking**: Top 5 local (guardado en `localStorage`) que registra movimientos y tiempo.

---

## 🚀 Tecnologías utilizadas

- **React 19**: Interfaz moderna basada en componentes funcionales.
- **Vite 8**: Desarrollo y construcción ultra-rápida.
- **SASS (SCSS)**: Estilos modulares y avanzados.
- **JavaScript (ES6+)**: Lógica del juego y gestión de estado.
- **AI Agents**: **Gemini CLI**, **Copilot CLI** y **Codex** actuando como copilotos activos en el desarrollo.

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
3. Arranca el proyecto: `npm run dev`

---

## 🔮 Futuras funcionalidades

- **Backend (Express + MySQL)**: Persistencia global del ranking y autenticación simple.
- **Sonidos**: Efectos de sonido retro para mejorar la inmersión.

---

## 🤖 Desarrollo Asistido por IA

Este proyecto ha sido desarrollado con la ayuda de **Gemini CLI**, **Copilot CLI** y **Codex**. Gracias a la colaboración entre programadora y asistente, el flujo de trabajo es dinámico y eficiente:

- **Metodología OpenSpec**: Cada cambio se planifica, diseña y ejecuta siguiendo especificaciones estrictas para garantizar la calidad.
- **Pair Programming**: La IA no solo genera código, sino que asiste en la arquitectura, refactorización y resolución de bugs complejos en tiempo real.

---

## 🏗️ Estado del proyecto y Agradecimientos

Este proyecto es un "work in progress" constante. Actualmente estoy aprendiendo a construir el backend para conectarlo y hacerlo 100% funcional y persistente. Se aceptan comentarios, sugerencias y PRs.

**Agradecimientos:**

- A **Iván**, mi profesor, por su guía y su infinita curiosidad.
- A **Adalab**, por abrirme las puertas del mundo tech.
- A las **IA**, por ser las mejores compañeras de código.
- A toda la comunidad **OpenSource** por las herramientas que hacen esto posible.

---

---

_Si has tenido que mirar en Google el significado de alguna cosa, tranquila, no eres la única. Lo "breve, conciso y preciso" no van de la mano de "que lo entiendan también los juniors"._

**Desarrollado con ❤️ y mucha paciencia**

_¡Gracias por leer hasta el final!_
