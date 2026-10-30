import { X, Keyboard } from 'lucide-react';
import './ShortcutsModal.css';

const shortcuts = [
    { keys: ['Space'], action: 'Play / Pause timer' },
    { keys: ['R'], action: 'Reset timer' },
    { keys: ['1'], action: 'Switch to Focus mode' },
    { keys: ['2'], action: 'Switch to Short Break' },
    { keys: ['3'], action: 'Switch to Long Break' },
    { keys: ['N'], action: 'Focus task input' },
    { keys: ['S'], action: 'Open Settings' },
    { keys: ['D'], action: 'Open Stats Dashboard' },
    { keys: ['?'], action: 'Show Keyboard Shortcuts' },
    { keys: ['Esc'], action: 'Close any modal' },
];

export default function ShortcutsModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="shortcuts-modal glass" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-row">
                        <Keyboard size={20} className="modal-icon" />
                        <h2>Keyboard Shortcuts</h2>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <div className="shortcuts-list">
                    {shortcuts.map((s, i) => (
                        <div key={i} className="shortcut-row">
                            <div className="shortcut-keys">
                                {s.keys.map((k) => (
                                    <kbd key={k} className="key-badge">{k}</kbd>
                                ))}
                            </div>
                            <span className="shortcut-action">{s.action}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
