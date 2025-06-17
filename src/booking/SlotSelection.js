import React from 'react';
import WeekSelector from './WeekSelector';

const SlotSelection = ({
    selectedServices,
    totalDuration,
    selectedDate,
    setSelectedDate,
    availableSlots,
    setAvailableSlots,
    selectedSlot,
    setSelectedSlot,
    fetchReservedSlots,
    onNextStep,
    onPrevStep,
    error
}) => {

    return (
        <div className="slots-section">
            <h3>Créneaux disponibles pour :</h3>
            <ul>
                {selectedServices.map(service => (
                    <li key={service.id}>{service.title} - {service.duration} min</li>
                ))}
            </ul>

            <h3>Choisissez un jour :</h3>
            <WeekSelector
                setSelectedDate={setSelectedDate}
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
};

export default SlotSelection;
