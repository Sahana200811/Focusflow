import { useState, useRef } from 'react';
import { useTasks } from '../../context/TaskContext';
import {
    Plus,
    Trash2,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Circle,
    Loader,
    GripVertical,
    ListTodo,
    Download,
    Flag,
} from 'lucide-react';
import TaskBreakdown from './TaskBreakdown';
import './KanbanBoard.css';

const COLUMNS = [
    { id: 'todo', label: 'To Do', icon: Circle, accentClass: 'accent-todo' },
    { id: 'in-progress', label: 'In Progress', icon: Loader, accentClass: 'accent-progress' },
    { id: 'done', label: 'Done', icon: CheckCircle2, accentClass: 'accent-done' },
];

const NEXT_STATUS = { todo: 'in-progress', 'in-progress': 'done' };
const PREV_STATUS = { 'in-progress': 'todo', done: 'in-progress' };

const PRIORITY_COLORS = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981',
};
const PRIORITY_LABELS = { high: 'High', medium: 'Med', low: 'Low' };

export default function KanbanBoard() {
    const { addTask, deleteTask, moveTask, getTasksByStatus, stats, exportTasksJSON, exportTasksCSV } = useTasks();
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newPriority, setNewPriority] = useState('medium');
    const [showExport, setShowExport] = useState(false);
    const [draggedTask, setDraggedTask] = useState(null);
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            addTask(newTaskTitle, newPriority);
            setNewTaskTitle('');
            inputRef.current?.focus();
        }
    };

    // Drag & Drop handlers
    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
        e.target.classList.add('dragging');
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('dragging');
        setDraggedTask(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetStatus) => {
        e.preventDefault();
        if (draggedTask && draggedTask.status !== targetStatus) {
            moveTask(draggedTask.id, targetStatus);
        }
        setDraggedTask(null);
    };

    return (
        <div className="kanban-container">
            {/* AI Task Breakdown */}
            <TaskBreakdown onAddTasks={(title) => addTask(title, 'medium')} />

            {/* Task Input */}
            <form className="task-input-form glass" onSubmit={handleSubmit}>
                <div className="input-wrapper">
                    <ListTodo size={18} className="input-icon" />
                    <input
                        ref={inputRef}
                        type="text"
                        className="task-input"
                        placeholder="Add a new task..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        id="task-input"
                    />
                </div>
                {/* Priority Selector */}
                <div className="priority-selector">
                    {Object.entries(PRIORITY_COLORS).map(([key, color]) => (
                        <button
                            key={key}
                            type="button"
                            className={`priority-dot ${newPriority === key ? 'active' : ''}`}
                            style={{ '--dot-color': color }}
                            onClick={() => setNewPriority(key)}
                            title={`${PRIORITY_LABELS[key]} Priority`}
                        >
                            <Flag size={12} />
                        </button>
                    ))}
                </div>
                <button type="submit" className="add-btn" disabled={!newTaskTitle.trim()} id="add-task-btn">
                    <Plus size={18} />
                    Add
                </button>
            </form>

            {/* Stats Bar with Export */}
            <div className="stats-bar">
                <div className="stat-chip">
                    <span className="stat-dot todo"></span>
                    <span>{stats.todo} To Do</span>
                </div>
                <div className="stat-chip">
                    <span className="stat-dot progress"></span>
                    <span>{stats.inProgress} Active</span>
                </div>
                <div className="stat-chip">
                    <span className="stat-dot done"></span>
                    <span>{stats.done} Done</span>
                </div>
                <div className="export-wrapper">
                    <button className="export-btn" onClick={() => setShowExport(!showExport)} title="Export Tasks">
                        <Download size={14} />
                    </button>
                    {showExport && (
                        <div className="export-menu glass">
                            <button onClick={() => { exportTasksJSON(); setShowExport(false); }}>Export JSON</button>
                            <button onClick={() => { exportTasksCSV(); setShowExport(false); }}>Export CSV</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Kanban Columns */}
            <div className="kanban-columns">
                {COLUMNS.map((col) => {
                    const tasks = getTasksByStatus(col.id);
                    const Icon = col.icon;
                    return (
                        <div
                            key={col.id}
                            className={`kanban-column glass ${col.accentClass} ${draggedTask ? 'drop-target' : ''}`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, col.id)}
                        >
                            <div className="column-header">
                                <Icon size={16} className="column-icon" />
                                <h3 className="column-title">{col.label}</h3>
                                <span className="column-count">{tasks.length}</span>
                            </div>
                            <div className="column-tasks">
                                {tasks.length === 0 ? (
                                    <div className="empty-state">
                                        <span>{draggedTask ? 'Drop here' : 'No tasks'}</span>
                                    </div>
                                ) : (
                                    tasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onDelete={deleteTask}
                                            onMoveNext={NEXT_STATUS[col.id] ? () => moveTask(task.id, NEXT_STATUS[col.id]) : null}
                                            onMovePrev={PREV_STATUS[col.id] ? () => moveTask(task.id, PREV_STATUS[col.id]) : null}
                                            onDragStart={handleDragStart}
                                            onDragEnd={handleDragEnd}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function TaskCard({ task, onDelete, onMoveNext, onMovePrev, onDragStart, onDragEnd }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        setTimeout(() => onDelete(task.id), 300);
    };

    const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;

    return (
        <div
            className={`task-card glass-hover ${isDeleting ? 'deleting' : ''} ${task.status === 'done' ? 'completed' : ''}`}
            draggable
            onDragStart={(e) => onDragStart(e, task)}
            onDragEnd={onDragEnd}
        >
            <div className="task-content">
                <GripVertical size={14} className="task-grip" />
                <span
                    className="task-priority-bar"
                    style={{ backgroundColor: priorityColor }}
                    title={`${PRIORITY_LABELS[task.priority] || 'Medium'} Priority`}
                />
                <span className="task-title">{task.title}</span>
            </div>
            <div className="task-actions">
                {onMovePrev && (
                    <button className="task-action-btn move-prev" onClick={onMovePrev} title="Move back">
                        <ArrowLeft size={14} />
                    </button>
                )}
                {onMoveNext && (
                    <button className="task-action-btn move-next" onClick={onMoveNext} title="Move forward">
                        <ArrowRight size={14} />
                    </button>
                )}
                <button className="task-action-btn delete-btn" onClick={handleDelete} title="Delete task">
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}
