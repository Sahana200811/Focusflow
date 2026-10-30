import { useState, useEffect, useCallback } from 'react';
import { TimerProvider, useTimer } from './context/TimerContext';
import { TaskProvider } from './context/TaskContext';
import Header from './components/Header/Header';
import TimerDisplay from './components/Timer/TimerDisplay';
import KanbanBoard from './components/Tasks/KanbanBoard';
import SettingsModal from './components/Settings/SettingsModal';
import StatsPanel from './components/Stats/StatsPanel';
import ShortcutsModal from './components/Shortcuts/ShortcutsModal';
import './App.css';

function AppContent() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const timer = useTimer();

  // Close all modals
  const closeAll = useCallback(() => {
    setSettingsOpen(false);
    setStatsOpen(false);
    setShortcutsOpen(false);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      // Don't trigger shortcuts when typing in inputs
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        if (e.key === 'Escape') {
          e.target.blur();
        }
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          timer.toggleTimer();
          break;
        case 'r':
        case 'R':
          timer.resetTimer();
          break;
        case '1':
          timer.switchMode('work');
          break;
        case '2':
          timer.switchMode('shortBreak');
          break;
        case '3':
          timer.switchMode('longBreak');
          break;
        case 'n':
        case 'N':
          document.getElementById('task-input')?.focus();
          break;
        case 's':
        case 'S':
          closeAll();
          setSettingsOpen(true);
          break;
        case 'd':
        case 'D':
          closeAll();
          setStatsOpen(true);
          break;
        case '?':
          closeAll();
          setShortcutsOpen(true);
          break;
        case 'Escape':
          closeAll();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [timer, closeAll]);

  return (
    <div className="app">
      <Header
        onOpenSettings={() => { closeAll(); setSettingsOpen(true); }}
        onOpenStats={() => { closeAll(); setStatsOpen(true); }}
        onOpenShortcuts={() => { closeAll(); setShortcutsOpen(true); }}
      />
      <main className="dashboard">
        <section className="dashboard-timer" aria-label="Pomodoro Timer">
          <TimerDisplay />
        </section>
        <section className="dashboard-tasks" aria-label="Task Board">
          <KanbanBoard />
        </section>
      </main>
      <footer className="app-footer">
        <p>
          Built with focus & flow ⚡ •{' '}
          <button className="footer-link" onClick={() => setShortcutsOpen(true)}>
            Keyboard Shortcuts (?)
          </button>
        </p>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={timer.applySettings}
      />
      <StatsPanel isOpen={statsOpen} onClose={() => setStatsOpen(false)} />
      <ShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <TimerProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </TimerProvider>
  );
}

export default App;
