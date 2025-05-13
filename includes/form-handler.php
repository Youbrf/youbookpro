<?php
// Empêche l'accès direct
if (!defined('ABSPATH')) exit;

function youbookpro_handle_booking_form() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['youbookpro_booking'])) {

        $nom     = sanitize_text_field($_POST['nom'] ?? '');
        $prenom  = sanitize_text_field($_POST['prenom'] ?? '');
        $email   = sanitize_email($_POST['email'] ?? '');
        $tel     = sanitize_text_field($_POST['tel'] ?? '');
        $service = intval($_POST['service'] ?? 0);
        $date    = sanitize_text_field($_POST['date'] ?? '');
        $heure   = sanitize_text_field($_POST['heure'] ?? '');

        $employe_id = 123;

        // Inclure la fonction de log si nécessaire
        if (!function_exists('youbookpro_log')) {
            require_once plugin_dir_path(__FILE__) . 'helpers/logger.php';
        }

        youbookpro_log("Soumission du formulaire : nom=$nom, prénom=$prenom, email=$email, tel=$tel, service=$service, date=$date, heure=$heure");

        if ($nom && $prenom && $email && $tel && $service && $date && $heure) {

            // ✅ Étape 1 : Créer ou retrouver un client existant
            $client_title = "$prenom $nom";

            // Recherche d'un client existant avec le même email (tu peux adapter à ton besoin)
            $existing_client = get_posts([
                'post_type'  => 'youbook_client',
                'meta_key'   => '_client_email',
                'meta_value' => $email,
                'numberposts' => 1,
            ]);

            if (!empty($existing_client)) {
                $client_id = $existing_client[0]->ID;
                youbookpro_log("Client existant trouvé : ID = $client_id");
            } else {
                // Sinon, on le crée
                $client_id = wp_insert_post([
                    'post_type'   => 'youbook_client',
                    'post_title'  => $client_title,
                    'post_status' => 'publish',
                ]);

                if (!is_wp_error($client_id)) {
                    update_post_meta($client_id, '_client_email', $email);
                    update_post_meta($client_id, '_client_telephone', $tel);
                    youbookpro_log("Nouveau client créé : ID = $client_id");
                } else {
                    youbookpro_log("Erreur création client : " . $client_id->get_error_message());
                    return;
                }
            }

            // ✅ Étape 2 : Créer la réservation
            $reservation_id = wp_insert_post([
                'post_type'   => 'youbook_reservation',
                'post_title'  => "Réservation de $client_title",
                'post_status' => 'publish',
            ]);

            if (!is_wp_error($reservation_id)) {

                // 🔁 Remplacer par un employé réel plus tard (ex: depuis formulaire)
                $employe_id = 123; // ID fixe temporaire

                update_post_meta($reservation_id, '_youbook_reservation_client_id', $client_id);
                update_post_meta($reservation_id, '_youbook_reservation_employe_id', $employe_id);
                update_post_meta($reservation_id, '_reservation_service', $service);
                update_post_meta($reservation_id, '_reservation_date', $date);
                update_post_meta($reservation_id, '_reservation_heure', $heure);

                youbookpro_log("Réservation enregistrée : ID = $reservation_id");

                wp_redirect(add_query_arg('booking', 'success', wp_get_referer()));
                exit;

            } else {
                youbookpro_log("Erreur d'insertion réservation : " . $reservation_id->get_error_message());
            }

        } else {
            youbookpro_log("Champs manquants ou invalides");
        }
    }
}
add_action('init', 'youbookpro_handle_booking_form');
