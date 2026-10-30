import { useState } from 'react';
import { Wand2, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import './TaskBreakdown.css';

// Rule-based AI task breakdown
function breakdownTask(title) {
    const lower = title.toLowerCase();
    const subtasks = [];

    // Research / Study patterns
    if (lower.includes('study') || lower.includes('learn') || lower.includes('research')) {
        subtasks.push(
            `Gather resources and references for "${title}"`,
            `Read and take notes on key concepts`,
            `Summarize findings in your own words`,
            `Create flashcards or review questions`,
            `Practice with exercises or examples`
        );
    }
    // Build / Create / Develop patterns
    else if (lower.includes('build') || lower.includes('create') || lower.includes('develop') || lower.includes('make') || lower.includes('implement')) {
        subtasks.push(
            `Define requirements and scope for "${title}"`,
            `Plan the architecture / structure`,
            `Build the core functionality`,
            `Add styling and polish`,
            `Test and fix any issues`,
            `Document and review`
        );
    }
    // Write / Essay / Report patterns
    else if (lower.includes('write') || lower.includes('essay') || lower.includes('report') || lower.includes('paper') || lower.includes('document')) {
        subtasks.push(
            `Research and gather sources`,
            `Create an outline`,
            `Write the first draft`,
            `Review and revise`,
            `Proofread and finalize`
        );
    }
    // Design patterns
    else if (lower.includes('design') || lower.includes('ui') || lower.includes('ux') || lower.includes('prototype')) {
        subtasks.push(
            `Research UI/UX inspiration`,
            `Create wireframes / sketches`,
            `Build high-fidelity mockup`,
            `Get feedback and iterate`,
            `Finalize design assets`
        );
    }
    // Fix / Debug patterns
    else if (lower.includes('fix') || lower.includes('debug') || lower.includes('bug') || lower.includes('solve')) {
        subtasks.push(
            `Reproduce the issue`,
            `Identify the root cause`,
            `Implement the fix`,
            `Test the fix thoroughly`,
            `Document the resolution`
        );
    }
    // Generic fallback
    else {
        subtasks.push(
            `Break down "${title}" into smaller steps`,
            `Gather necessary materials / resources`,
            `Work on the first part`,
            `Work on the remaining parts`,
            `Review and finalize`
        );
    }

    return subtasks;
}

export default function TaskBreakdown({ onAddTasks }) {
    const [input, setInput] = useState('');
    const [subtasks, setSubtasks] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleBreakdown = () => {
        if (!input.trim()) return;
        setSubtasks(breakdownTask(input));
        setIsExpanded(true);
    };

    const handleAddAll = () => {
        subtasks.forEach((st) => onAddTasks(st));
        setInput('');
        setSubtasks([]);
        setIsExpanded(false);
    };

    const handleAddOne = (task) => {
        onAddTasks(task);
        setSubtasks((prev) => prev.filter((t) => t !== task));
    };

    return (
        <div className="breakdown-container glass">
            <button
                className="breakdown-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <Wand2 size={16} />
                <span>AI Task Breakdown</span>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isExpanded && (
                <div className="breakdown-body">
                    <div className="breakdown-input-row">
                        <input
                            type="text"
                            className="breakdown-input"
                            placeholder="Describe a big task, e.g. 'Build a portfolio website'"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleBreakdown()}
                            id="ai-breakdown-input"
                        />
                        <button className="breakdown-btn" onClick={handleBreakdown} disabled={!input.trim()} id="ai-breakdown-btn">
                            <Wand2 size={14} />
                            Break Down
                        </button>
                    </div>

                    {subtasks.length > 0 && (
                        <div className="subtask-list">
                            {subtasks.map((st, i) => (
                                <div key={i} className="subtask-item">
                                    <span className="subtask-number">{i + 1}</span>
                                    <span className="subtask-text">{st}</span>
                                    <button className="subtask-add" onClick={() => handleAddOne(st)} title="Add this task">
                                        <Plus size={14} />
                                    </button>
                                </div>
                            ))}
                            <button className="add-all-btn" onClick={handleAddAll}>
                                <Plus size={14} />
                                Add All to Board
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
