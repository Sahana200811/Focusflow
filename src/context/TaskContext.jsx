import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { fireConfetti } from '../utils/confetti';
import { recordTaskCompleted } from '../utils/stats';

const TaskContext = createContext(null);

const STORAGE_KEY = 'focusflow_tasks';

function loadTasks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState(loadTasks);

    useEffect(() => {
        saveTasks(tasks);
    }, [tasks]);

    const addTask = useCallback((title, priority = 'medium') => {
        if (!title.trim()) return;
        const newTask = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: title.trim(),
            status: 'todo',
            priority,
            createdAt: new Date().toISOString(),
        };
        setTasks((prev) => [newTask, ...prev]);
    }, []);

    const deleteTask = useCallback((id) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const moveTask = useCallback((id, newStatus) => {
        setTasks((prev) =>
            prev.map((t) => {
                if (t.id === id) {
                    // Fire confetti when moving to done
                    if (newStatus === 'done' && t.status !== 'done') {
                        fireConfetti();
                        recordTaskCompleted();
                    }
                    return { ...t, status: newStatus };
                }
                return t;
            })
        );
    }, []);

    const editTask = useCallback((id, newTitle) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
        );
    }, []);

    const updatePriority = useCallback((id, priority) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, priority } : t))
        );
    }, []);

    const getTasksByStatus = useCallback(
        (status) => tasks.filter((t) => t.status === status),
        [tasks]
    );

    // Export tasks as JSON
    const exportTasksJSON = useCallback(() => {
        const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `focusflow_tasks_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, [tasks]);

    // Export tasks as CSV
    const exportTasksCSV = useCallback(() => {
        const header = 'ID,Title,Status,Priority,Created\n';
        const rows = tasks.map((t) =>
            `"${t.id}","${t.title}","${t.status}","${t.priority || 'medium'}","${t.createdAt}"`
        ).join('\n');
        const blob = new Blob([header + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `focusflow_tasks_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }, [tasks]);

    const stats = {
        total: tasks.length,
        todo: tasks.filter((t) => t.status === 'todo').length,
        inProgress: tasks.filter((t) => t.status === 'in-progress').length,
        done: tasks.filter((t) => t.status === 'done').length,
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                addTask,
                deleteTask,
                moveTask,
                editTask,
                updatePriority,
                getTasksByStatus,
                exportTasksJSON,
                exportTasksCSV,
                stats,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const ctx = useContext(TaskContext);
    if (!ctx) throw new Error('useTasks must be used within TaskProvider');
    return ctx;
}
