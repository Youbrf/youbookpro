<?php if (isset($_GET['booking']) && $_GET['booking'] === 'success') : ?>
    <div style="padding:10px; background:#d4edda; border:1px solid #c3e6cb; color:#155724; margin-bottom:15px;">
        ✅ Votre réservation a bien été enregistrée.
    </div>
<?php else: ?>
    <form action="" method="post">
        <!-- Champ caché pour valider le formulaire -->
        <input type="hidden" name="youbookpro_booking" value="1">

        <!-- Champ caché : ID d'employé en dur (optionnel, ou défini en PHP côté serveur si tu préfères) -->
        <!-- <input type="hidden" name="employe_id" value="123"> -->

        <!-- Nom -->
        <label for="nom">Nom :</label>
        <input type="text" name="nom" id="nom" required>

        <!-- Prénom -->
        <label for="prenom">Prénom :</label>
        <input type="text" name="prenom" id="prenom" required>

        <!-- Email -->
        <label for="email">Email :</label>
        <input type="email" name="email" id="email" required>

        <!-- Téléphone -->
        <label for="tel">Téléphone :</label>
        <input type="text" name="tel" id="tel" required>

        <!-- Service -->
        <label for="service">Service :</label>
        <select name="service" id="service" required>
            <option value="">-- Choisir un service --</option>
            <option value="1">Service 1</option>
            <option value="2">Service 2</option>
            <option value="3">Service 3</option>
            <!-- Ajoute ici plus de services si nécessaire -->
        </select>

        <!-- Date -->
        <label for="date">Date :</label>
        <input type="date" name="date" id="datepicker" required>

        <!-- Heure -->
        <label for="heure">Heure :</label>
        <input type="time" name="heure" id="timepicker" required>

        <!-- Bouton de soumission -->
        <button type="submit">Réserver</button>
    </form>
<?php endif; ?>
