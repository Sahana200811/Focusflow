import confetti from 'canvas-confetti';

export function fireConfetti() {
    // Burst from center
    confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
        gravity: 1.2,
        ticks: 150,
    });

    // Side cannons after a short delay
    setTimeout(() => {
        confetti({
            particleCount: 40,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 },
            colors: ['#7c3aed', '#06b6d4', '#10b981'],
        });
        confetti({
            particleCount: 40,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 },
            colors: ['#f59e0b', '#ef4444', '#7c3aed'],
        });
    }, 200);
}
