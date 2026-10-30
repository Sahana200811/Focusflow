import { useState, useMemo } from 'react';
import { Zap, Settings, BarChart3, Flame, Keyboard, CloudRain, Coffee, Music, VolumeX } from 'lucide-react';
import { getStreak } from '../../utils/streak';
import { ambientEngine } from '../../utils/sounds';
import './Header.css';

const AMBIENT_OPTIONS = [
    { id: 'rain', label: 'Rain', icon: CloudRain },
    { id: 'lofi', label: 'Lo-Fi', icon: Music },
    { id: 'cafe', label: 'Café', icon: Coffee },
];

export default function Header({ onOpenSettings, onOpenStats, onOpenShortcuts }) {
    const streak = useMemo(() => getStreak(), []);
    const [ambient, setAmbient] = useState(null);

    const toggleAmbient = (type) => {
        if (ambient === type) {
            ambientEngine.stop();
            setAmbient(null);
        } else {
            ambientEngine.play(type);
            setAmbient(type);
        }
    };

    return (
        <header className="app-header">
            <div className="header-content">
                <div className="header-left">
                    <div className="logo">
                        <div className="logo-icon">
                            <Zap size={20} />
                        </div>
                        <h1 className="logo-text">
                            Focus<span className="logo-accent">Flow</span>
                        </h1>
                    </div>

                    {/* Streak Badge */}
                    {streak.current > 0 && (
                        <div className="streak-badge" title={`Best: ${streak.best} days`}>
                            <Flame size={14} className="streak-flame" />
                            <span>{streak.current}d streak</span>
                        </div>
                    )}
                </div>

                <div className="header-right">
                    {/* Ambient Sound Toggles */}
                    <div className="ambient-controls">
                        {AMBIENT_OPTIONS.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                className={`ambient-btn ${ambient === id ? 'active' : ''}`}
                                onClick={() => toggleAmbient(id)}
                                title={`${label} sounds`}
                                id={`ambient-${id}`}
                            >
                                {ambient === id ? <VolumeX size={14} /> : <Icon size={14} />}
                            </button>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <button className="header-btn" onClick={onOpenShortcuts} title="Keyboard Shortcuts" id="shortcut-btn">
                        <Keyboard size={16} />
                    </button>
                    <button className="header-btn" onClick={onOpenStats} title="Productivity Stats" id="stats-btn">
                        <BarChart3 size={16} />
                    </button>
                    <button className="header-btn" onClick={onOpenSettings} title="Settings" id="settings-btn">
                        <Settings size={16} />
                    </button>
                </div>
            </div>
        </header>
    );
}
