import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function BookingBlock() {
    const [step, setStep] = useState(1);
    const [selectedServices, setSelectedServices] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

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
                    <button onClick={() => setStep(1)}>Retour</button>
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


document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('youbookpro-booking-root');
    if (container) {
        const root = createRoot(container);
        root.render(<BookingBlock />);
    }
});
