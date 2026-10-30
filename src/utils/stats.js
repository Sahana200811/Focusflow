const STATS_KEY = 'focusflow_stats';

function loadStats() {
    try {
        return JSON.parse(localStorage.getItem(STATS_KEY)) || [];
    } catch {
        return [];
    }
}

function saveStats(stats) {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function getToday() {
    return new Date().toISOString().split('T')[0];
}

// Record a completed focus session
export function recordSession(durationMinutes) {
    const stats = loadStats();
    const today = getToday();
    const existing = stats.find((s) => s.date === today);

    if (existing) {
        existing.sessions += 1;
        existing.focusMinutes += durationMinutes;
    } else {
        stats.push({ date: today, sessions: 1, focusMinutes: durationMinutes, tasksCompleted: 0 });
    }

    saveStats(stats);
}

// Record a completed task
export function recordTaskCompleted() {
    const stats = loadStats();
    const today = getToday();
    const existing = stats.find((s) => s.date === today);

    if (existing) {
        existing.tasksCompleted += 1;
    } else {
        stats.push({ date: today, sessions: 0, focusMinutes: 0, tasksCompleted: 1 });
    }

    saveStats(stats);
}

// Get last N days of stats for charts
export function getStatsForDays(n = 7) {
    const stats = loadStats();
    const days = [];

    for (let i = n - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const existing = stats.find((s) => s.date === dateStr);
        days.push({
            date: dateStr,
            day: dayName,
            sessions: existing?.sessions || 0,
            focusMinutes: existing?.focusMinutes || 0,
            tasksCompleted: existing?.tasksCompleted || 0,
        });
    }

    return days;
}

// Get total stats
export function getTotalStats() {
    const stats = loadStats();
    return stats.reduce(
        (acc, s) => ({
            totalSessions: acc.totalSessions + s.sessions,
            totalFocusMinutes: acc.totalFocusMinutes + s.focusMinutes,
            totalTasks: acc.totalTasks + s.tasksCompleted,
            daysActive: acc.daysActive + 1,
        }),
        { totalSessions: 0, totalFocusMinutes: 0, totalTasks: 0, daysActive: 0 }
    );
}
