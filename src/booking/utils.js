export function groupServicesByCategory(services) {
    return services.reduce((acc, service) => {
        const category = service.category?.name || 'Autres';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(service);
        return acc;
    }, {});
}

export function decodeHTMLEntities(text) {
    const txt = document.createElement('textarea');
    txt.innerHTML = text;
    return txt.value;
}

export function parseTime(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

export function minutesToTime(minutes) {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
}

export function computeAvailableSlots(reservations, totalDuration, openingMinutes, closingMinutes, interval) {
    const allSlots = [];
    for (let time = openingMinutes; time <= closingMinutes - totalDuration; time += interval) {
        allSlots.push(time);
    }

    const reservedRanges = reservations.map(res => {
        const start = parseTime(res.time);
        const end = start + parseInt(res.duration);
        return { start, end };
    });

    const available = allSlots.filter(slot => {
        const slotEnd = slot + totalDuration;
        return !reservedRanges.some(res =>
            (slot < res.end && slotEnd > res.start) 
        );
    });

    return available;
}

export const OPENING_HOUR_MINUTES = 10 * 60;
export const CLOSING_HOUR_MINUTES = 18 * 60;
export const SLOT_INTERVAL_MINUTES = 30;
