let selectedServices = [];
let selectedDate = null;
let selectedTime = null;

document.addEventListener('DOMContentLoaded', function () {
    const chooseSlotBtn = document.querySelector('#service-summary button');
    const calendarStep = document.querySelector('#calendar-step');
    const flatpickrInput = document.querySelector('#youbook-calendar');
    const availableSlotsDiv = document.querySelector('#available-slots');
    const confirmSlotBtn = document.querySelector('#confirm-slot');
    const clientFormStep = document.getElementById('client-form-step');

    if (chooseSlotBtn) {
        chooseSlotBtn.addEventListener('click', function () {
            calendarStep.style.display = 'block';
            this.style.display = 'none';

            flatpickrInput._flatpickr = flatpickr(flatpickrInput, {
                minDate: 'today',
                dateFormat: 'Y-m-d',
                onChange: function (selectedDates, dateStr) {
                    // Appel AJAX pour les créneaux du jour sélectionné
                    fetchSlotsForDate(dateStr);
                }
            });
        });
    }

    function fetchSlotsForDate(dateStr) {
        // Tu adapteras ceci à ta logique de dispo côté serveur plus tard
        const dummySlots = ['09:00', '10:30', '14:00', '15:30'];
        availableSlotsDiv.innerHTML = dummySlots.map(slot => {
            return `<button class="slot-btn" data-slot="${slot}">${slot}</button>`;
        }).join('');

        document.querySelectorAll('.slot-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
                confirmSlotBtn.disabled = false;
                confirmSlotBtn.dataset.selectedSlot = this.dataset.slot;
                confirmSlotBtn.dataset.selectedDate = flatpickrInput.value;
            });
        });
    }

    confirmSlotBtn.addEventListener('click', function () {
        selectedDate = this.dataset.selectedDate;
        selectedTime = this.dataset.selectedSlot;
        calendarStep.style.display = 'none';
        clientFormStep.style.display = 'block';
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const selectButtons = document.querySelectorAll('.select-service');
    const summaryCount = document.getElementById('summary-count');
    const summaryPrice = document.getElementById('summary-price');
    const serviceSummary = document.getElementById('service-summary');
    const calendarStep = document.getElementById('calendar-step');
    const categoryWrapper = document.querySelector('.youbookpro-categories');
    const selectedServicesList = document.getElementById('selected-services-list');
    const selectedSummaryBlock = document.getElementById('selected-services-summary');

    selectButtons.forEach(button => {
        button.addEventListener('click', function () {
            const item = button.closest('.service-item');
            const id = item.dataset.id;
            const title = item.querySelector('strong').textContent;
            const price = parseFloat(item.dataset.price || 0);

            const exists = selectedServices.find(s => s.id === id);
            if (!exists && selectedServices.length < 2) {
                selectedServices.push({ id, title, price });
            } else if (exists) {
                selectedServices = selectedServices.filter(s => s.id !== id);
            }

            summaryCount.textContent = selectedServices.length;
            summaryPrice.textContent = selectedServices.reduce((sum, s) => sum + s.price, 0).toFixed(2);

            serviceSummary.style.display = selectedServices.length > 0 ? 'block' : 'none';
        });
    });

    const showCalendarBtn = document.getElementById('show-calendar-step');
    if (showCalendarBtn) {
        showCalendarBtn.addEventListener('click', function () {
            if (selectedServices.length === 0) return;

            if (categoryWrapper) categoryWrapper.style.display = 'none';
            serviceSummary.style.display = 'none';

            selectedServicesList.innerHTML = '';
            selectedServices.forEach(service => {
                const li = document.createElement('li');
                li.textContent = `${service.title} – ${service.price.toFixed(2)} €`;
                selectedServicesList.appendChild(li);
            });
            selectedSummaryBlock.style.display = 'block';
            calendarStep.style.display = 'block';
        });
    }
});

const clientForm = document.getElementById('youbookpro-client-form');
if (clientForm) {
    clientForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('client-name').value;
        const email = document.getElementById('client-email').value;
        const phone = document.getElementById('client-phone').value;
        const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;

        console.log("[YouBookPro] Soumission du formulaire client");
        console.log("[YouBookPro] Nom :", name);
        console.log("[YouBookPro] Email :", email);
        console.log("[YouBookPro] Téléphone :", phone);
        console.log("[YouBookPro] Paiement :", paymentMethod);
        console.log("[YouBookPro] Services sélectionnés :", selectedServices);
        console.log("[YouBookPro] Date sélectionnée :", selectedDate);
        console.log("[YouBookPro] Heure sélectionnée :", selectedTime);

        const formData = new FormData();
        formData.append('action', 'youbookpro_create_reservation');
        formData.append('client_name', name);
        formData.append('client_email', email);
        formData.append('client_phone', phone);
        formData.append('payment_method', paymentMethod);
        formData.append('services', JSON.stringify(selectedServices));
        formData.append('date', selectedDate);
        formData.append('time', selectedTime);

        console.log("[YouBookPro] Données envoyées :", Object.fromEntries(formData.entries()));

        fetch(youbookpro_ajax.ajax_url, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            console.log("[YouBookPro] Réponse du serveur :", data);
            if (data.success) {
                alert('Réservation créée avec succès !');
                window.location.reload();
            } else {
                alert('Erreur : ' + data.message);
                console.warn("[YouBookPro] Erreur retournée :", data.message);
            }
        })
        .catch(err => {
            console.error('[YouBookPro] Erreur AJAX :', err);
            alert("Une erreur s'est produite.");
        });
    });
}

