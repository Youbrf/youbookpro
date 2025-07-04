export async function fetchServices() {
  const res = await fetch('/wp-json/youbookpro/v1/services');
  if (!res.ok) throw new Error('Erreur chargement services');
  return res.json();
}

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

export function computeAvailableSlots(
    reservations, 
    totalDuration, 
    openingMinutes, 
    closingMinutes, 
    interval,
    checkDate) 
    {
        const allSlots = [];
        for (let time = openingMinutes; time <= closingMinutes - totalDuration; time += interval) {
            allSlots.push(time);
        }
        const reservedRanges = reservations.map(res => {
            const start = parseTime(res.time);
            const end = start + parseInt(res.duration);
            return { start, end };
        });

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const isToday = checkDate === todayStr;
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const available = allSlots.filter(slot => {
            const slotEnd = slot + totalDuration;
            if (isToday && slot <= currentMinutes) {
                return false;
            }
            return !reservedRanges.some(res =>
                (slot < res.end && slotEnd > res.start) 
            );
        });

        return available.map(minutesToTime);
    }

export async function fetchReservationsByDate(date) {
    try {
        const response = await fetch(`/wp-json/youbookpro/v1/reservations?date=${date}`);
        const reservations = await response.json();
        return reservations;
    } catch (error) {
        console.error('Erreur lors de la récupération des réservations :', error);
        return [];
    }
}

export const OPENING_HOUR_MINUTES = 10 * 60;
export const CLOSING_HOUR_MINUTES = 18 * 60;
export const SLOT_INTERVAL_MINUTES = 30;

export function saveBookingState({ selectedDate, selectedSlot, selectedServices, totalDuration }) {
    const state = { selectedDate, selectedSlot, selectedServices, totalDuration };
    sessionStorage.setItem('bookingState', JSON.stringify(state));
}

export function restoreBookingState() {
    const savedState = sessionStorage.getItem('bookingState');
    if (!savedState) return null;
    try {
        return JSON.parse(savedState);
    } catch {
        sessionStorage.removeItem('bookingState');
        return null;
    }
}