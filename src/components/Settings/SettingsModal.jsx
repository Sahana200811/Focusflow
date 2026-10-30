import { useState, useEffect } from 'react';
import { Settings, X, Clock, Volume2 } from 'lucide-react';
import './SettingsModal.css';

const SETTINGS_KEY = 'focusflow_settings';

const DEFAULT_SETTINGS = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    soundEnabled: true,
    autoStartBreak: false,
};

export function loadSettings() {
    try {
        const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY));
        return { ...DEFAULT_SETTINGS, ...stored };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export default function SettingsModal({ isOpen, onClose, onSave }) {
    const [settings, setSettings] = useState(loadSettings);

    useEffect(() => {
        if (isOpen) setSettings(loadSettings());
    }, [isOpen]);

    const handleChange = (key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        saveSettings(settings);
        onSave(settings);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-row">
                        <Settings size={20} className="modal-icon" />
                        <h2>Settings</h2>
                    </div>
                    <button className="modal-close" onClick={onClose} id="settings-close">
                        <X size={18} />
                    </button>
                </div>

                <div className="settings-body">
                    {/* Timer Durations */}
                    <div className="settings-section">
                        <div className="section-label">
                            <Clock size={15} />
                            <span>Timer Durations (minutes)</span>
                        </div>
                        <div className="duration-inputs">
                            <div className="duration-field">
                                <label>Focus</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="120"
                                    value={settings.workDuration}
                                    onChange={(e) => handleChange('workDuration', parseInt(e.target.value) || 25)}
                                    id="settings-work"
                                />
                            </div>
                            <div className="duration-field">
                                <label>Short Break</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={settings.shortBreakDuration}
                                    onChange={(e) => handleChange('shortBreakDuration', parseInt(e.target.value) || 5)}
                                    id="settings-short"
                                />
                            </div>
                            <div className="duration-field">
                                <label>Long Break</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={settings.longBreakDuration}
                                    onChange={(e) => handleChange('longBreakDuration', parseInt(e.target.value) || 15)}
                                    id="settings-long"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sound Settings */}
                    <div className="settings-section">
                        <div className="section-label">
                            <Volume2 size={15} />
                            <span>Sound</span>
                        </div>
                        <div className="toggle-row">
                            <span>Alarm on timer end</span>
                            <button
                                className={`toggle-btn ${settings.soundEnabled ? 'active' : ''}`}
                                onClick={() => handleChange('soundEnabled', !settings.soundEnabled)}
                                id="settings-sound-toggle"
                            >
                                <span className="toggle-thumb" />
                            </button>
                        </div>
                        <div className="toggle-row">
                            <span>Auto-start break timer</span>
                            <button
                                className={`toggle-btn ${settings.autoStartBreak ? 'active' : ''}`}
                                onClick={() => handleChange('autoStartBreak', !settings.autoStartBreak)}
                                id="settings-autostart-toggle"
                            >
                                <span className="toggle-thumb" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={handleSave} id="settings-save">Save Changes</button>
                </div>
            </div>
        </div>
    );
}
