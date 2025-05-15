<?php
function youbookpro_services_shortcode() {
    ob_start();

    // Récupère toutes les catégories de service
    $categories = get_posts([
        'post_type' => 'youbook_categorie',
        'posts_per_page' => -1,
        'orderby' => 'title',
        'order' => 'ASC',
    ]);

    if ($categories) {
        echo '<div class="youbookpro-categories">';

        foreach ($categories as $category) {
            $cat_id = $category->ID;
            $cat_name = get_the_title($cat_id);

            // Requête les services liés à cette catégorie
            $services = get_posts([
                'post_type' => 'youbook_service',
                'posts_per_page' => -1,
                'meta_key' => '_youbookpro_categorie',
                'meta_value' => $cat_id,
            ]);

            if ($services) {
                echo '<div class="service-category">';
                echo '<h2>' . esc_html($cat_name) . '</h2>';
                echo '<ul class="service-list">';

                foreach ($services as $service) {
                    $price = get_post_meta($service->ID, '_youbookpro_price', true);
                    $duration = get_post_meta($service->ID, '_youbookpro_duration', true);

                    echo '<li class="service-item" data-id="' . esc_attr($service->ID) . '" data-price="' . esc_attr($price) . '">';
                    echo '<strong>' . esc_html($service->post_title) . '</strong><br>';
                    echo 'Prix : ' . esc_html($price) . ' €<br>';
                    echo 'Durée : ' . esc_html($duration) . ' min<br>';
                    echo '<button class="select-service">Sélectionner</button>';
                    echo '</li>';
                }

                echo '</ul></div>';
            }
        }

        echo '</div>';
    } else {
        echo '<p>Aucune catégorie trouvée.</p>';
    }

    // Ajouter la div de résumé
    echo '
        <div id="service-summary" style="display:none;">
            <span><strong><span id="summary-count">0</span></strong> service(s) sélectionné(s)</span>
            <span>Total : <strong><span id="summary-price">0.00</span> €</strong></span>
            <button id="show-calendar-step">Choisir un créneau</button>
        </div>

        <div id="selected-services-summary" style="display:none; margin-top: 20px;">
            <h3>Service(s) sélectionné(s)</h3>
            <ul id="selected-services-list"></ul>
        </div>

        <div id="calendar-step" style="display:none; margin-top: 20px;">
            <h3>Choisissez une date</h3>
            <input type="text" id="youbook-calendar" placeholder="Sélectionner une date" readonly>

            <div id="slots-container" style="margin-top: 15px;">
                <h4>Créneaux disponibles</h4>
                <div id="available-slots">Veuillez d’abord choisir une date.</div>
            </div>

            <button id="confirm-slot" style="margin-top: 15px;" disabled>Confirmer ce créneau</button>
        </div>
        <div id="client-form-step" style="display:none; margin-top: 20px;">
            <h3>Vos informations</h3>
            <form id="youbookpro-client-form" method="post">
                <input type="hidden" name="youbookpro_booking" value="1">

                <label for="client-name">Nom :</label>
                <input type="text" id="client-name" name="nom" required>

                <label for="client-email">Email :</label>
                <input type="email" id="client-email" name="email" required>

                <label for="client-phone">Téléphone :</label>
                <input type="text" id="client-phone" name="tel">

                <h4>Méthode de paiement</h4>
                <label>
                    <input type="radio" name="payment_method" value="sur_place" checked>
                    Paiement sur place
                </label><br>
                <label>
                    <input type="radio" name="payment_method" value="en_ligne">
                    Paiement en ligne
                </label><br>

                <button type="submit">Finaliser la réservation</button>
            </form>
        </div>

    ';

    return ob_get_clean();
}
add_shortcode('youbookpro_services', 'youbookpro_services_shortcode');
