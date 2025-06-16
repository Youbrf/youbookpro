import React, { useState, useEffect } from 'react';
import {
    parseTime,
    minutesToTime,
    computeAvailableSlots,
    OPENING_HOUR_MINUTES,
    CLOSING_HOUR_MINUTES,
    SLOT_INTERVAL_MINUTES
} from './utils'; 

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

function WeekSelector({ onDateSelected, totalDuration, onDisabledDatesFetched}) {
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekDates, setWeekDates] = useState([]);
    const [disabledDates, setDisabledDates] = useState([]);

    const isToday = (date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const disablePrevWeek = weekDates.some(date => isToday(date));

    useEffect(() => {
        const fetchDisabledDates = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                const response = await fetch(`/wp-json/youbookpro/v1/reservations/from?from=${today}`);
                const reservations = await response.json();

                const groupedByDate = {};
                reservations.forEach(res => {
                    if (!groupedByDate[res.date]) {
                        groupedByDate[res.date] = [];
                    }
                    groupedByDate[res.date].push(res);
                });

                const fullDates = Object.entries(groupedByDate).filter(([date, dayReservations]) => {
                    const available = computeAvailableSlots(dayReservations, totalDuration, OPENING_HOUR_MINUTES, CLOSING_HOUR_MINUTES, SLOT_INTERVAL_MINUTES);
                    return available.length === 0;
                }).map(([date]) => date);

                const sundays = [];
                const date = new Date();
                for (let i = 0; i < 30; i++) {
                    const checkDate = new Date(date);
                    checkDate.setDate(date.getDate() + i);
                    if (checkDate.getDay() === 0) {
                        sundays.push(checkDate.toISOString().split('T')[0]);
                    }
                }

                const allDisabled = Array.from(new Set([...fullDates, ...sundays]));

                setDisabledDates(allDisabled);
                onDisabledDatesFetched?.(allDisabled);

            } catch (error) {
                console.error('Erreur lors de la récupération des dates désactivées:', error);
            }
        };

        fetchDisabledDates();
    }, [totalDuration]);

    useEffect(() => {
        setWeekDates(generateWeekDays(currentWeekStart));
    }, [currentWeekStart]);

    useEffect(() => {
        const today = new Date();
        const formatted = today.toISOString().split('T')[0];
        setSelectedDate(today); 
        onDateSelected(formatted); 
    }, []);

    const handleDayClick = (date) => {
        if (date.getDay() === 0) return;
        const formattedDate = date.toISOString().split('T')[0];
        if (disabledDates.includes(formattedDate)) return;

        setSelectedDate(date);
        onDateSelected(formattedDate);
    };

    return (
        <div className="week-selector">
            <button
                onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
                disabled={disablePrevWeek}
                style={{
                    opacity: disablePrevWeek ? 0.3 : 1,
                    cursor: disablePrevWeek ? 'not-allowed' : 'pointer'
                }}
                title={
                    disablePrevWeek
                        ? "Impossible de revenir avant cette semaine"
                        : "Semaine précédente"
                }
            >
                &lt;
            </button>

            <div className="week-days">
                {weekDates.map((date) => {
                    const day = date.getDate();
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    const isSunday = date.getDay() === 0;
                    const formattedDate = date.toISOString().split('T')[0];
                    const isDisabled = isSunday || disabledDates.includes(formattedDate);

                    return (
                        <button
                            key={formattedDate}
                            disabled={isDisabled}
                            className={`day-btn ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                            onClick={() => handleDayClick(date)}
                            title={isDisabled ? "Jour indisponible" : ""}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
            >
                &gt;
            </button>
        </div>
    );

}


function SlotSelection({
    selectedServices,
    totalDuration,
    selectedDate,
    setSelectedDate,
    availableSlots,
    setAvailableSlots, 
    selectedSlot,
    setSelectedSlot,
    disabledDates,
    setDisabledDatesGlobal, 
    fetchReservedSlots,
    onNextStep,
    onPrevStep,
    error
}) {
    
    return (
        <div className="slots-section">
            <h3>Créneaux disponibles pour :</h3>
            <ul>
                {selectedServices.map(service => (
                    <li key={service.id}>{service.title} - {service.duration} min</li>
                ))}
            </ul>
            <h3>Choisissez un jour :</h3>

            {}
            <WeekSelector
                onDisabledDatesFetched={(dates) => setDisabledDatesGlobal(dates)}
                onDateSelected={(dateStr) => {
                    setSelectedDate(dateStr);
                    fetchReservedSlots(dateStr); 
                    setSelectedSlot(null); 
                }}
                totalDuration={totalDuration}
            />

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
                        <p>Aucun créneau disponible pour cette date.</p>
                    )}
                </div>
            )}
            {selectedSlot && (
                <div className="next-step-bar centered">
                    <div><strong>Créneau sélectionné :</strong> {selectedSlot}</div>
                    <button onClick={onNextStep}>Passer à l’étape suivante →</button>
                </div>
            )}
            <button onClick={onPrevStep}>← Retour aux services</button>

            {error && ( 
                <div className="error-popup">
                    {error}
                </div>
            )}
        </div>
    );
}

export default SlotSelection;
