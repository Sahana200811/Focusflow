import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { playAlarm } from '../utils/sounds';
import { recordSession } from '../utils/stats';
import { recordSessionToday } from '../utils/streak';
import { loadSettings } from '../components/Settings/SettingsModal';

const TimerContext = createContext(null);

function getModes(settings) {
    return {
        work: { label: 'Focus', duration: (settings?.workDuration || 25) * 60, color: 'var(--accent-primary)' },
        shortBreak: { label: 'Short Break', duration: (settings?.shortBreakDuration || 5) * 60, color: 'var(--accent-success)' },
        longBreak: { label: 'Long Break', duration: (settings?.longBreakDuration || 15) * 60, color: 'var(--accent-secondary)' },
    };
}

export function TimerProvider({ children }) {
    const [settings, setSettings] = useState(loadSettings);
    const [modes, setModes] = useState(() => getModes(settings));
    const [mode, setMode] = useState('work');
    const [timeLeft, setTimeLeft] = useState(() => getModes(settings).work.duration);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const intervalRef = useRef(null);

    const totalDuration = modes[mode].duration;
    const progress = 1 - timeLeft / totalDuration;

    // Apply settings
    const applySettings = useCallback((newSettings) => {
        setSettings(newSettings);
        const newModes = getModes(newSettings);
        setModes(newModes);
        setIsRunning(false);
        setTimeLeft(newModes[mode].duration);
    }, [mode]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current);
                        setIsRunning(false);

                        // Play alarm
                        if (settings.soundEnabled) {
                            playAlarm();
                        }

                        if (mode === 'work') {
                            const newCount = sessionsCompleted + 1;
                            setSessionsCompleted(newCount);
                            // Record stats
                            recordSession(settings.workDuration || 25);
                            recordSessionToday();

                            const nextMode = newCount % 4 === 0 ? 'longBreak' : 'shortBreak';
                            setMode(nextMode);
                            const nextDuration = getModes(settings)[nextMode].duration;

                            if (settings.autoStartBreak) {
                                setTimeout(() => setIsRunning(true), 500);
                            }
                            return nextDuration;
                        } else {
                            setMode('work');
                            return getModes(settings).work.duration;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, mode, sessionsCompleted, settings]);

    const toggleTimer = useCallback(() => {
        setIsRunning((prev) => !prev);
    }, []);

    const resetTimer = useCallback(() => {
        setIsRunning(false);
        setTimeLeft(modes[mode].duration);
    }, [mode, modes]);

    const switchMode = useCallback((newMode) => {
        setIsRunning(false);
        setMode(newMode);
        setTimeLeft(modes[newMode].duration);
    }, [modes]);

    const formatTime = useCallback((seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    return (
        <TimerContext.Provider
            value={{
                mode,
                timeLeft,
                isRunning,
                totalDuration,
                progress,
                sessionsCompleted,
                modeConfig: modes[mode],
                modes,
                settings,
                toggleTimer,
                resetTimer,
                switchMode,
                formatTime,
                applySettings,
            }}
        >
            {children}
        </TimerContext.Provider>
    );
}

export function useTimer() {
    const ctx = useContext(TimerContext);
    if (!ctx) throw new Error('useTimer must be used within TimerProvider');
    return ctx;
}
