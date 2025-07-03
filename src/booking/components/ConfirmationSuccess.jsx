const ConfirmationSuccess = ({ confirmationData }) => {
    if (!confirmationData) return null;

    return (
        <div className="confirmation-success">
            <h2>Réservation confirmée ✅</h2>
            <p>Merci pour votre réservation ! Voici les détails :</p>
            <ul>
                <li><strong>Date :</strong> {confirmationData.selectedDate}</li>
                <li><strong>Heure :</strong> {confirmationData.selectedSlot}</li>
                <li><strong>Services :</strong>
                    <ul>
                        {confirmationData.selectedServices.map(service => (
                            <li key={service.id}>{service.name}</li>
                        ))}
                    </ul>
                </li>
                <li><strong>Numéro de réservation :</strong> #{confirmationData.reservationId}</li>
            </ul>
        </div>
    );
};
export default ConfirmationSuccess;