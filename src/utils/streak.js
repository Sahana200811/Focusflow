const STREAK_KEY = 'focusflow_streak';

function getToday() {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function loadStreak() {
    try {
        const data = JSON.parse(localStorage.getItem(STREAK_KEY));
        return data || { current: 0, lastDate: null, best: 0 };
    } catch {
        return { current: 0, lastDate: null, best: 0 };
    }
}

function saveStreak(streak) {
    localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
}

export function getStreak() {
    const streak = loadStreak();
    const today = getToday();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // If last activity was before yesterday, streak is broken
    if (streak.lastDate && streak.lastDate !== today && streak.lastDate !== yesterday) {
        streak.current = 0;
    }

    return streak;
}

export function recordSessionToday() {
    const streak = loadStreak();
    const today = getToday();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (streak.lastDate === today) {
        // Already recorded today
        return streak;
    }

    if (streak.lastDate === yesterday) {
        streak.current += 1;
    } else {
        streak.current = 1;
    }

    streak.lastDate = today;
    streak.best = Math.max(streak.best, streak.current);
    saveStreak(streak);
    return streak;
}
