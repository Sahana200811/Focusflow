# FocusFlow ⏱️

> An advanced, aesthetic Pomodoro timer and Kanban task dashboard designed to boost productivity and flow state. Built with React 19, Vite, and modern Web APIs.

---

##  Features

- ** Flexible Pomodoro Engine**
  - Configurable Focus, Short Break, and Long Break intervals.
  - Visual circular progress ring with auto-start breaks and cycle switching.
  - Real-time tab title notifications.

- ** Kanban Task Management**
  - Organize workflow with **To Do**, **In Progress**, and **Done** columns.
  - Priority labeling (**High**, **Medium**, **Low**) with visual badges.
  - Move tasks with one-click transitions or drag actions.
  - Persistent local storage — your data stays on your machine.

- ** Smart Task Breakdown**
  - Auto-deconstructs complex tasks (e.g. *Study*, *Develop*, *Write*, *Research*) into actionable subtask checklists.
  - Progress tracking for subtasks with automatic completion sync.

- **📊 Productivity Analytics & Streaks**
  - Interactive charts powered by [Recharts](https://recharts.org/) (Focus minutes, sessions completed, and daily breakdown).
  - Configurable historical view: 7, 14, or 30 days.
  - Streak tracking (current streak, longest streak, and total focus time).

- **🎧 Synthesized Ambient Soundscape**
  - Built-in sound generator powered entirely by the **Web Audio API** — no heavy external audio assets.
  - Ambient noise modes: **Rain**, **Pink Noise**, and **White Noise**.
  - Crisp audio cues for timer completions.

- **🎉 Delightful Micro-Interactions**
  - Canvas confetti animations on task completion.
  - Responsive, modern glassmorphic dark theme.

- **⌨️ Keyboard-First Shortcuts**
  - Control your entire workflow without leaving the keyboard.

- **📱 Progressive Web App (PWA)**
  - Fully offline-ready with service worker caching and standalone display support.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Play / Pause timer |
| <kbd>R</kbd> | Reset current timer |
| <kbd>1</kbd> | Switch to **Focus** mode |
| <kbd>2</kbd> | Switch to **Short Break** mode |
| <kbd>3</kbd> | Switch to **Long Break** mode |
| <kbd>N</kbd> | Focus task input field |
| <kbd>S</kbd> | Open Settings modal |
| <kbd>D</kbd> | Open Stats Dashboard |
| <kbd>?</kbd> | Show Keyboard Shortcuts cheat sheet |
| <kbd>Esc</kbd> | Close any open modal |

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler / Build Tool**: [Vite 7](https://vite.dev/)
- **Charts & Data Viz**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio Engine**: Native Web Audio API
- **Styling**: Vanilla CSS (Modern CSS variables, Flexbox/Grid, Glassmorphism)

---

## 📁 Project Structure

```text
FocusFlow/
├── public/
│   ├── manifest.json       # PWA web app manifest
│   ├── sw.js               # Service worker for offline caching
│   └── vite.svg            # App icon
├── src/
│   ├── components/
│   │   ├── Header/         # Navigation bar & quick controls
│   │   ├── Settings/       # Timer, sound, and theme preferences
│   │   ├── Shortcuts/      # Hotkey reference modal
│   │   ├── Stats/          # Recharts productivity dashboard
│   │   ├── Tasks/          # Kanban board & task decomposition
│   │   └── Timer/          # Pomodoro ring display & controls
│   ├── context/
│   │   ├── TaskContext.jsx # State management for tasks & subtasks
│   │   └── TimerContext.jsx# State management for timer intervals
│   ├── utils/
│   │   ├── confetti.js     # Confetti trigger utility
│   │   ├── sounds.js       # Web Audio API ambient engine & alarms
│   │   ├── stats.js        # Analytics calculation helpers
│   │   └── streak.js       # Daily streak tracker
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # React root mount
│   └── index.css           # Global typography & design system
├── index.html              # HTML entry point
├── package.json            # Scripts & dependencies
└── vite.config.js          # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or `yarn` / `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sahana200811/Focusflow.git
   cd Focusflow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
