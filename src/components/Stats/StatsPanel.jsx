import { useState, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import { BarChart3, TrendingUp, CheckCircle, Clock, X, Flame } from 'lucide-react';
import { getStatsForDays, getTotalStats } from '../../utils/stats';
import { getStreak } from '../../utils/streak';
import './StatsPanel.css';

const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b'];

export default function StatsPanel({ isOpen, onClose }) {
    const [range, setRange] = useState(7);

    const dailyStats = useMemo(() => getStatsForDays(range), [range, isOpen]);
    const totals = useMemo(() => getTotalStats(), [isOpen]);
    const streak = useMemo(() => getStreak(), [isOpen]);

    const pieData = useMemo(() => [
        { name: 'Focus', value: totals.totalFocusMinutes || 1 },
        { name: 'Sessions', value: totals.totalSessions || 1 },
        { name: 'Tasks', value: totals.totalTasks || 1 },
    ], [totals]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="stats-panel glass" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-row">
                        <BarChart3 size={20} className="modal-icon" />
                        <h2>Productivity Stats</h2>
                    </div>
                    <button className="modal-close" onClick={onClose} id="stats-close">
                        <X size={18} />
                    </button>
                </div>

                <div className="stats-body">
                    {/* Summary Cards */}
                    <div className="stats-cards">
                        <div className="stat-card glass">
                            <Clock size={18} className="stat-card-icon focus-icon" />
                            <span className="stat-card-value">{totals.totalFocusMinutes}</span>
                            <span className="stat-card-label">Focus Mins</span>
                        </div>
                        <div className="stat-card glass">
                            <TrendingUp size={18} className="stat-card-icon sessions-icon" />
                            <span className="stat-card-value">{totals.totalSessions}</span>
                            <span className="stat-card-label">Sessions</span>
                        </div>
                        <div className="stat-card glass">
                            <CheckCircle size={18} className="stat-card-icon tasks-icon" />
                            <span className="stat-card-value">{totals.totalTasks}</span>
                            <span className="stat-card-label">Tasks Done</span>
                        </div>
                        <div className="stat-card glass">
                            <Flame size={18} className="stat-card-icon streak-icon" />
                            <span className="stat-card-value">{streak.current}</span>
                            <span className="stat-card-label">Day Streak</span>
                        </div>
                    </div>

                    {/* Range Selector */}
                    <div className="range-tabs">
                        {[7, 14, 30].map((r) => (
                            <button
                                key={r}
                                className={`range-tab ${range === r ? 'active' : ''}`}
                                onClick={() => setRange(r)}
                            >
                                {r}D
                            </button>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="charts-grid">
                        <div className="chart-card glass">
                            <h4>Focus Minutes</h4>
                            <ResponsiveContainer width="100%" height={160}>
                                <AreaChart data={dailyStats}>
                                    <defs>
                                        <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                                    <Tooltip contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
                                    <Area type="monotone" dataKey="focusMinutes" stroke="#7c3aed" fill="url(#focusGrad)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-card glass">
                            <h4>Sessions & Tasks</h4>
                            <ResponsiveContainer width="100%" height={160}>
                                <BarChart data={dailyStats}>
                                    <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                                    <Tooltip contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
                                    <Bar dataKey="sessions" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="tasksCompleted" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
