import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import ServiceSelection from './ServiceSelection'; 
import SlotSelection from './SlotSelection';     
import ConfirmationForm from './ConfirmationForm'; 

function BookingBlock() {
    const [step, setStep] = useState(1);
    const [selectedServices, setSelectedServices] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [reservations, setReservations] = useState([]); 
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [disabledDates, setDisabledDatesGlobal] = useState([]); 
    const totalDuration = selectedServices.reduce((sum, service) => sum + parseInt(service.duration), 0);
    
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
                setError('Impossible de charger les services.'); 
                setLoading(false);
            });
    }, []);
        
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

    
    
    const handleSubmit = async (clientData) => {
        try {
            const res = await fetch('/wp-json/youbookpro/v1/reserve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientData)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Erreur lors de la réservation');
            }

            const data = await res.json();
            
            setStep(1);
            setSelectedServices([]);
            setSelectedSlot(null);
            setSelectedDate(null);
            setReservations([]); 
            setAvailableSlots([]); 
            
            return data; 

        } catch (error) {
            console.error("Erreur lors de la réservation (dans BookingBlock) :", error);
            
            throw error;
        }
    };


    
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000); 
            return () => clearTimeout(timer);
        }
    }, [error]);


    return (
        <div className="youbookpro-booking">

            {step === 1 && (
                <ServiceSelection
                    services={services}
                    selectedServices={selectedServices}
                    toggleService={toggleService}
                    error={error} 
                    onNextStep={() => {
                        if (selectedServices.length > 0) {
                            setStep(2);
                            setError(null); 
                        } else {
                            setError("Veuillez sélectionner au moins un service.");
                        }
                    }}
                />
            )}

            {step === 2 && (
                <SlotSelection
                    selectedServices={selectedServices}
                    totalDuration={totalDuration}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    reservations={reservations} 
                    
                    availableSlots={availableSlots}
                    setAvailableSlots={setAvailableSlots} 
                    selectedSlot={selectedSlot}
                    setSelectedSlot={setSelectedSlot}
                    disabledDates={disabledDates}
                    setDisabledDatesGlobal={setDisabledDatesGlobal} 
                    onNextStep={() => {
                        if (selectedSlot) {
                            setStep(3);
                            setError(null); 
                        } else {
                             setError("Veuillez sélectionner un créneau horaire.");
                        }
                    }}
                    onPrevStep={() => {
                        setStep(1);
                        setError(null); 
                    }}
                    error={error} 
                />
            )}

            {step === 3 && (
                <ConfirmationForm
                    selectedDate={selectedDate}
                    selectedSlot={selectedSlot}
                    selectedServices={selectedServices}
                    totalDuration={totalDuration}
                    onSubmit={handleSubmit} 
                    onPrevStep={() => {
                        setStep(2);
                        setError(null); 
                    }}
                    error={error} 
                />
            )}
        </div>
    );
}


document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('youbookpro-booking-root');
    if (container) {
        const root = createRoot(container);
        root.render(<BookingBlock />);
    }
});

export default BookingBlock; 
