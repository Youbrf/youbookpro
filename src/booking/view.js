import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function BookingBlock() {
    const [step, setStep] = useState(1);
    const [selectedServices, setSelectedServices] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [reservedSlots, setReservedSlots] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const totalDuration = selectedServices.reduce((sum, service) => sum + parseInt(service.duration), 0);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const clientData = {
            first_name: formData.get("first_name"),
            last_name: formData.get("last_name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            date: selectedDate,
            time: selectedSlot,
            services: selectedServices.map(s => s.id),
            duration: totalDuration
        };

        fetch('/wp-json/youbookpro/v1/reserve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData)
        })
        .then(res => res.json())
        .then(data => {
            alert('Réservation confirmée !');
            setStep(1);
            setSelectedServices([]);
            setSelectedSlot(null);
            setSelectedDate(null);
        })
        .catch(error => {
            console.error("Erreur lors de la réservation :", error);
            alert("Erreur lors de la réservation.");
        });
    };
    const generateAvailableSlots = (reservations) => {
        const opening = 10 * 60;    
        const closing = 18 * 60;  
        const interval = 15;      
        const durationNeeded = totalDuration; 

        const slots = [];

        for (let t = opening; t <= closing - durationNeeded; t += interval) {
            const slotStart = t;
            const slotEnd = t + durationNeeded;

            if (slotEnd > closing) {
                continue;
            }

            const overlap = reservations.some(r => {
                return (slotStart < r.end && slotEnd > r.start);
            });

            if (!overlap) {
                slots.push(minutesToTime(slotStart));
            }
        }

        setAvailableSlots(slots);
    };

    const fetchReservedSlots = (date) => {
        fetch(`/wp-json/youbookpro/v1/reservations?date=${date}`)
            .then(res => res.json())
            .then(data => {
                setReservedSlots(data.map(r => r.time));
                setReservations(data);

                const transformed = data.map(r => {
                    const start = parseTime(r.time);
                    const end = start + parseInt(r.duration);
                    return { start, end };
                });

                generateAvailableSlots(transformed);
            });
    };


    const toggleService = (service) => {
        setSelectedServices(prev => {
            const exists = prev.find(s => s.id === service.id);
            if (exists) {
                setError(null); 
                return prev.filter(s => s.id !== service.id);
            } else {
                if (prev.length >= 2) {
                    setError("Vous pouvez sélectionner jusqu'à 2 services maximum.");
                    return prev;
                }
                setError(null); 
                return [...prev, service];
            }
        });
    };


    useEffect(() => {
        fetch('/wp-json/youbookpro/v1/reservations')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des réservations');
                }
                return response.json();
            })
            .then(data => {
                setReservations(data);
            })
            .catch(error => {
                console.error('Erreur fetch réservations:', error);
            });
    }, []);

    useEffect(() => {
        fetch('/wp-json/youbookpro/v1/services')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur de chargement des services');
                }
                return response.json();
            })
            .then(data => {
                setServices(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Erreur lors du chargement des services:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
    if (error) {
        const timer = setTimeout(() => setError(null), 3000); 
        return () => clearTimeout(timer);
    }
    }, [error]);

    return (
        <div className="youbookpro-booking">

            {step === 1 && (
                <div className="services-section">
                    {loading ? (
                        <p>Chargement des services...</p>
                    ) : (
                        Object.entries(groupServicesByCategory(services)).map(([category, categoryServices]) => (
                            <div key={category} className="category-block">
                                <h4 className="category-title">{decodeHTMLEntities(category)}</h4>
                                <table className="category-table">
                                    <thead>
                                        <tr>
                                            <th>Nom</th>
                                            <th>Prix</th>
                                            <th>Durée</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categoryServices.map(service => (
                                            <tr key={service.id}>
                                                <td>{decodeHTMLEntities(service.title)}</td>
                                                <td>{service.price} €</td>
                                                <td>{service.duration} min</td>
                                                <td>
                                                    <button onClick={() => toggleService(service)}>
                                                        {selectedServices.find(s => s.id === service.id) ? 'Retirer' : 'Sélectionner'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))
                    )}
                    {error && (
                        <div className="error-popup">
                            {error}
                        </div>
                    )}
                    {selectedServices.length > 0 && (
                        <div className="next-step-bar centered">
                            <div>
                                <strong>{selectedServices.length}</strong> service(s) sélectionné(s) – 
                                <strong> {selectedServices.reduce((total, s) => total + parseFloat(s.price), 0)} €</strong>
                            </div>
                            <button onClick={() => setStep(2)}>Choisir un créneau →</button>
                        </div>
                    )}
                </div>
                
            )}
            {step === 2 && (
                <div className="slots-section">
                    <h3>Créneaux disponibles pour :</h3>
                    <ul>
                        {selectedServices.map(service => (
                            <li key={service.id}>{decodeHTMLEntities(service.title)} - {service.duration} min</li>
                        ))}
                    </ul>
                    <h3>Choisissez un jour :</h3>

                    <WeekSelector onDateSelected={(dateStr) => {
                        setSelectedDate(dateStr);
                        fetchReservedSlots(dateStr);
                    }} />

                    {selectedDate && (
                    <div>
                        <h4>Créneaux disponibles pour le {selectedDate}</h4>
                        {availableSlots.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                            {availableSlots.map(slot => (
                            <button
                                key={slot}
                                className={`slot-btn-vertical ${selectedSlot === slot ? 'selected' : ''}`}
                                onClick={() => setSelectedSlot(slot)}
                            >
                                {slot}
                            </button>
                            ))}
                        </div>
                        ) : (
                        <p>Aucun créneau disponible.</p>
                        )}
                    </div>
                    )}
                    {selectedSlot && (
                        <div className="next-step-bar centered">
                            <div><strong>Créneau sélectionné :</strong> {selectedSlot}</div>
                            <button onClick={() => setStep(3)}>Passer à l’étape suivante →</button>
                        </div>
                    )}
                    <button onClick={() => setStep(1)}>Retour</button>
                </div>
            )}

            {step === 3 && (
                <div className="confirmation-section">
                    <h3>Confirmation de la réservation</h3>
                    <p><strong>Date :</strong> {selectedDate}</p>
                    <p><strong>Heure :</strong> {selectedSlot}</p>
                    <ul>
                        {selectedServices.map(service => (
                            <li key={service.id}>{decodeHTMLEntities(service.title)} – {service.duration} min</li>
                        ))}
                    </ul>
                    <p><strong>Durée totale :</strong> {totalDuration} min</p>
                    <p><strong>Montant total :</strong> {selectedServices.reduce((total, s) => total + parseFloat(s.price), 0)} €</p>

                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Prénom" name="first_name" required />
                        <input type="text" placeholder="Nom" name="last_name" required />
                        <input type="email" placeholder="Email" name="email" required />
                        <input type="tel" placeholder="Téléphone" name="phone" required />
                        <button type="submit">Confirmer la réservation</button>
                    </form>

                    <button onClick={() => setStep(2)}>← Retour au créneau</button>
                </div>
            )}
        </div>
    );

}

function groupServicesByCategory(services) {
    return services.reduce((acc, service) => {
        const category = service.category?.name || 'Autres';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(service);
        return acc;
    }, {});
}

function decodeHTMLEntities(text) {
    const txt = document.createElement('textarea');
    txt.innerHTML = text;
    return txt.value;
}

function parseTime(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

function minutesToTime(minutes) {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('youbookpro-booking-root');
    if (container) {
        const root = createRoot(container);
        root.render(<BookingBlock />);
    }
});

export default function WeekSelector({ onDateSelected }) {
    const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekDates, setWeekDates] = useState([]);

    useEffect(() => {
        setWeekDates(generateWeekDays(currentWeekStart));
    }, [currentWeekStart]);

    useEffect(() => {
        const formatted = selectedDate.toISOString().split('T')[0];
        onDateSelected(formatted);
    }, []);

    const handleDayClick = (date) => {
        const day = date.getDay();
        if (day === 0) return; 
        setSelectedDate(date);
        const formatted = date.toISOString().split('T')[0];
        onDateSelected(formatted);
    };

    return (
        <div className="week-selector">
            <button onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}>&lt;</button>
            <div className="week-days">
                {weekDates.map(date => {
                    const day = date.getDate();
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    const isSunday = date.getDay() === 0;

                    return (
                        <button
                            key={date.toISOString()}
                            className={`day-btn ${isSelected ? 'selected' : ''} ${isSunday ? 'disabled' : ''}`}
                            onClick={() => handleDayClick(date)}
                            disabled={isSunday}
                            title={isSunday ? "Fermé le dimanche" : ""}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
            <button onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}>&gt;</button>
        </div>
    );
}

// UTILS
function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay(); 
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
    return new Date(d.setDate(diff));
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function generateWeekDays(startDate) {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        days.push(d);
    }
    return days;
}
