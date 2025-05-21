import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function BookingBlock() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="services-section">
            {loading ? (
                <p className="services-loading">Chargement des services...</p>
            ) : (
                Object.entries(groupServicesByCategory(services)).map(([category, categoryServices]) => (
                    console.log('category:', category, 'type:', typeof category),
                    <div key={category} className="category-block">
                        <h4 className="category-title">{decodeHTMLEntities(category)}</h4>
                        <div className="category-table-wrapper">
                            <table className="category-table">
                                <thead>
                                    <tr>
                                        <th>Nom du service</th>
                                        <th>Prix</th>
                                        <th>Durée</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoryServices.map(service => (
                                        <tr key={service.id}>
                                            <td>{decodeHTMLEntities(service.title)}</td>
                                            <td>{service.price} €</td>
                                            <td>{service.duration} min</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
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
