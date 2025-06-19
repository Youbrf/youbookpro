import React, { useState, useEffect } from 'react';
import {
    computeAvailableSlots,
    fetchReservationsByDate,
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

function WeekSelector({ 
    totalDuration,
    selectedDate, 
    setSelectedDate,
    setAvailableSlots,
}) {
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
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
                setAvailableSlots(computeAvailableSlots( await fetchReservationsByDate(today),totalDuration,OPENING_HOUR_MINUTES, CLOSING_HOUR_MINUTES, SLOT_INTERVAL_MINUTES));

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
        setSelectedDate(formatted); 
    }, []);

    const handleDayClick = async (date) => {
        if (date.getDay() === 0) return;
        const formattedDate = date.toISOString().split('T')[0];
        if (disabledDates.includes(formattedDate)) return;
        setSelectedDate(formattedDate);
        setAvailableSlots(computeAvailableSlots( await fetchReservationsByDate(formattedDate), totalDuration, OPENING_HOUR_MINUTES, CLOSING_HOUR_MINUTES, SLOT_INTERVAL_MINUTES));
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

            <button onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}>
                &gt;
            </button>
        </div>
    );
}

export default WeekSelector;
