import React from 'react';
import { groupServicesByCategory, decodeHTMLEntities } from '../utils';

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

						{/* Desktop version */}
						<table className="category-table desktop-only">
							<tbody>
								{categoryServices.map(service => (
									<tr key={service.id}>
										<td>{decodeHTMLEntities(service.title)}</td>
										<td>{service.price} €</td>
										<td>{service.duration} min</td>
										<td>
											<button onClick={() => toggleService(service)}>
												{selectedServices.find(s => s.id === service.id)
													? 'Retirer'
													: 'Sélectionner'}
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{/* Mobile version */}
						<div className="mobile-only">
							{categoryServices.map(service => (
								<div key={service.id} className="mobile-service">
									<div className="service-title">{decodeHTMLEntities(service.title)}</div>
									<div className="service-info">
										<div className="left-info">
											<span>{service.price} €</span> • <span>{service.duration} min</span>
										</div>
										<div className="right-button">
											<button onClick={() => toggleService(service)}>
												{selectedServices.find(s => s.id === service.id)
													? 'Retirer'
													: 'Sélectionner'}
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				))
			)}

			{error && <div className="error-popup">{error}</div>}

			{selectedServices.length > 0 && (
				<div className="next-step-bar centered">
					<div>
						<strong>{selectedServices.length}</strong> service(s) sélectionné(s) –
						<strong>
							{' '}
							{selectedServices.reduce((total, s) => total + parseFloat(s.price), 0)} €
						</strong>
					</div>
					<button onClick={onNextStep}>Choisir un créneau →</button>
				</div>
			)}
		</div>
	);
}

export default ServiceSelection;
