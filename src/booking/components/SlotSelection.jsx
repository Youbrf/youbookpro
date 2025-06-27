import React, { useEffect } from 'react';
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
    onNextStep,
    onPrevStep,
    error
}) => {
    useEffect(() => {
        setSelectedSlot(null);
    }, [selectedDate]);

    return (
    <div className="slots-section">
        <div className="slots-container">
        <div className="slots-left">
            <h3>Choix de la date et heure </h3>
            <h5>Créneaux disponibles pour le <strong>{selectedDate}</strong></h5>
            <WeekSelector
            setAvailableSlots={setAvailableSlots}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            totalDuration={totalDuration}
            />

            {selectedDate && (
            <div>
                {availableSlots.length > 0 ? (
                <div className="slots-list">
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
        </div>

        <div className="slots-right">
            <h6>Prestation sélectionnée :</h6>
            <ul>
            {selectedServices.map(service => (
                <li key={service.id}>
                {service.title} - {service.duration} min
                </li>
            ))}
            </ul>
        </div>
        </div>

        {selectedSlot && (
        <div className="next-step-bar centered">
            <div><strong>Créneau sélectionné</strong> {selectedSlot}</div>
            <button onClick={onNextStep}>Passer à l’étape suivante →</button>
        </div>
        )}

        <button onClick={onPrevStep}>← Retour aux services</button>

        {error && <div className="error-popup">{error}</div>}
    </div>
    );
 }

export default SlotSelection;
