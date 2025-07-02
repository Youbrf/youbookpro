import React, { useState, useEffect } from 'react';
import { saveBookingState } from "../utils.js";

function ConfirmationForm({
    selectedDate,
    selectedSlot,
    selectedServices,
    totalDuration,
    onSubmit,
    onPrevStep,
    error 
}) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [guestMode, setGuestMode] = useState(false);

    useEffect(() => {
        if (!window.youbookproData) {
            setUser(null);
            setIsLoadingUser(false);
            return;
        }
        fetch(window.youbookproData.restUrl, {
            method: 'GET',
            headers: {
                'X-WP-Nonce': window.youbookproData.nonce,
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
        })
        .then(res => {
            if (!res.ok) throw new Error('Utilisateur non connecté');
            return res.json();
        })
        .then(data => {
            setUser(data);
            setFirstName(data.first_name || '');
            setLastName(data.last_name || '');
            setEmail(data.user_email || data.email || '');
            setPhone(data.phone || '');
            setIsLoadingUser(false);
        })
        .catch(() => {
            setUser(null);
            setIsLoadingUser(false);
        });
    }, []);

    if (isLoadingUser) return <p>Chargement...</p>;

    const validateForm = () => {
        if (!user) {
            if (!firstName || !lastName || !email || !phone) {
                setSubmitError("Veuillez remplir tous les champs obligatoires.");
                return false;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setSubmitError("Veuillez entrer une adresse email valide.");
                return false;
            }
        }
        setSubmitError(null);
        return true;
    };

    const handleLocalSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null); 
        setSubmitSuccess(false); 

        if (!validateForm()) return;

        setIsSubmitting(true); 
        const clientData = {
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            notes, 
            date: selectedDate,
            time: selectedSlot,
            services: selectedServices.map(s => s.id),
            duration: totalDuration,
            guest: !user,
        };

        try {
            await onSubmit(clientData);
            setSubmitSuccess(true);
        } catch (err) {
            console.error("Erreur de soumission du formulaire:", err);
            setSubmitError(err.message || "Une erreur est survenue lors de la réservation.");
            setSubmitSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="confirmation-section">
            {user ? (
                    <p>Bienvenue, {user.display_name} !</p>
                ) : (
                    <div>
                        <p>Vous n’êtes pas connecté, vous pouvez remplir le formulaire ci-dessous ou vous connecter.</p>
                        <div style={{ marginTop: '1em' }}>
                              <button
                                    onClick={() => {
                                    saveBookingState({ selectedDate, selectedSlot, selectedServices, totalDuration });
                                    window.location.href = '/my-account/?redirect_to=' + encodeURIComponent(window.location.href);
                                    }}
                                >
                                    Se connecter
                                </button>
                        </div>
                    </div>
                )}

            <h3>Confirmation de la réservation</h3>
            <div className="recap-condensed">
                <p><strong>{selectedDate}</strong> à <strong>{selectedSlot}</strong> – <strong>{totalDuration} min</strong></p>
                <p>
                    {selectedServices.map(service => (
                        `${service.title} (${service.duration}min, ${parseFloat(service.price).toFixed(2)}€)`
                    )).join(' · ')}
                </p>
                <p><strong>Total :</strong> {selectedServices.reduce((total, s) => total + parseFloat(s.price), 0).toFixed(2)} €</p>
            </div>

            <form onSubmit={handleLocalSubmit} noValidate>
                {!user && (
                    <>
                        <input
                            type="text"
                            placeholder="Prénom *"
                            name="first_name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Nom *"
                            name="last_name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email *"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Téléphone *"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </>
                )}

                <textarea
                    placeholder="Notes liées au rendez-vous (optionnel)"
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                />

                {isSubmitting && <p>Traitement de votre réservation...</p>}
                {submitError && <div className="error-popup">{submitError}</div>}
                {submitSuccess && <div className="success-popup">Réservation effectuée avec succès !</div>}
                {error && !submitError && <div className="error-popup">{error}</div>}

                <button type="submit" disabled={isSubmitting || submitSuccess}>
                    {isSubmitting ? 'Confirmation en cours...' : (submitSuccess ? 'Réservé !' : 'Confirmer la réservation')}
                </button>
            </form>

            <button onClick={onPrevStep} disabled={isSubmitting}>← Retour au créneau</button>
        </div>
    );
}

export default ConfirmationForm;
