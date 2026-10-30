import { useTimer } from '../../context/TimerContext';
import { Play, Pause, RotateCcw, Coffee, Brain, Sunset } from 'lucide-react';
import './TimerDisplay.css';

const modeIcons = {
    work: Brain,
    shortBreak: Coffee,
    longBreak: Sunset,
};

export default function TimerDisplay() {
    const {
        mode,
        timeLeft,
        isRunning,
        progress,
        sessionsCompleted,
        modeConfig,
        modes,
        toggleTimer,
        resetTimer,
        switchMode,
        formatTime,
    } = useTimer();

    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    const ModeIcon = modeIcons[mode];

    return (
        <div className="timer-container glass">
            {/* Mode Tabs */}
            <div className="timer-modes">
                {Object.entries(modes).map(([key, cfg]) => {
                    const Icon = modeIcons[key];
                    return (
                        <button
                            key={key}
                            className={`mode-tab ${mode === key ? 'active' : ''}`}
                            onClick={() => switchMode(key)}
                            id={`mode-${key}`}
                        >
                            <Icon size={14} />
                            {cfg.label}
                        </button>
                    );
                })}
            </div>

            {/* Circular Timer */}
            <div className="timer-ring-wrapper">
                <svg className="timer-svg" viewBox="0 0 280 280">
                    {/* Background Track */}
                    <circle
                        cx="140"
                        cy="140"
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="6"
                    />
                    {/* Progress Arc */}
                    <circle
                        cx="140"
                        cy="140"
                        r={radius}
                        fill="none"
                        stroke={modeConfig.color}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="timer-progress-ring"
                        style={{
                            filter: `drop-shadow(0 0 8px ${modeConfig.color})`,
                        }}
                    />
                    {/* Glow dot at the end of progress */}
                    {progress > 0 && (
                        <circle
                            cx={140 + radius * Math.sin(progress * 2 * Math.PI)}
                            cy={140 - radius * Math.cos(progress * 2 * Math.PI)}
                            r="4"
                            fill={modeConfig.color}
                            style={{
                                filter: `drop-shadow(0 0 6px ${modeConfig.color})`,
                            }}
                        />
                    )}
                </svg>

                <div className="timer-center">
                    <ModeIcon className="timer-mode-icon" size={28} style={{ color: modeConfig.color }} />
                    <span className={`timer-time ${isRunning ? 'pulsing' : ''}`}>
                        {formatTime(timeLeft)}
                    </span>
                    <span className="timer-label">{modeConfig.label}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="timer-controls">
                <button
                    className="control-btn reset-btn"
                    onClick={resetTimer}
                    title="Reset Timer"
                    id="timer-reset"
                >
                    <RotateCcw size={20} />
                </button>
                <button
                    className={`control-btn play-btn ${isRunning ? 'running' : ''}`}
                    onClick={toggleTimer}
                    title={isRunning ? 'Pause' : 'Start'}
                    id="timer-toggle"
                    style={{
                        '--btn-color': modeConfig.color,
                    }}
                >
                    {isRunning ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '2px' }} />}
                </button>
                <div className="session-count" title="Focus Sessions Completed">
                    <span className="session-number">{sessionsCompleted}</span>
                    <span className="session-label">Sessions</span>
                </div>
            </div>
        </div>
    );
}
