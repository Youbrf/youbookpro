import React from 'react';
import { groupServicesByCategory, decodeHTMLEntities } from './utils';

function ServiceSelection({ services, selectedServices, toggleService, error, onNextStep }) {
    const loading = services.length === 0 && !error; 

    return (
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
                    <button onClick={onNextStep}>Choisir un créneau →</button>
                </div>
            )}
        </div>
    );
}

export default ServiceSelection;
