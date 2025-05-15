document.addEventListener('DOMContentLoaded', function () {
    const selectedServices = new Map();

    function updateSummary() {
        const summaryDiv = document.getElementById('service-summary');
        if (selectedServices.size === 0) {
            summaryDiv.style.display = 'none';
        } else {
            summaryDiv.style.display = 'flex';
        }

        const totalPrice = Array.from(selectedServices.values()).reduce((sum, s) => sum + parseFloat(s.price), 0);
        summaryDiv.querySelector('#summary-count').textContent = selectedServices.size;
        summaryDiv.querySelector('#summary-price').textContent = totalPrice.toFixed(2);
    }

    document.querySelectorAll('.select-service').forEach(button => {
        button.addEventListener('click', function () {
            const item = this.closest('.service-item');
            const id = item.dataset.id;
            const price = item.dataset.price;

            if (selectedServices.has(id)) {
                selectedServices.delete(id);
                item.classList.remove('selected');
                this.textContent = "Sélectionner";
            } else {
                if (selectedServices.size >= 2) {
                    alert("Vous ne pouvez sélectionner que 2 services maximum.");
                    return;
                }
                selectedServices.set(id, { price });
                item.classList.add('selected');
                this.textContent = "Désélectionner";
            }

            updateSummary();
        });
    });
});
