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

        // Inclure la fonction de log
        if (!function_exists('youbookpro_log')) {
            require_once plugin_dir_path(__FILE__) . 'helpers/logger.php';
        }

        youbookpro_log("Soumission du formulaire : nom=$nom, prénom=$prenom, email=$email, tel=$tel, service=$service, date=$date, heure=$heure");

        if ($nom && $prenom && $email && $tel && $service && $date && $heure) {

            $post_id = wp_insert_post([
                'post_type'   => 'youbook_reservation',
                'post_title'  => "Réservation de $prenom $nom",
                'post_status' => 'publish',
            ]);

            if (!is_wp_error($post_id)) {
                update_post_meta($post_id, '_reservation_nom', $nom);
                update_post_meta($post_id, '_reservation_prenom', $prenom);
                update_post_meta($post_id, '_reservation_email', $email);
                update_post_meta($post_id, '_reservation_telephone', $tel);
                update_post_meta($post_id, '_reservation_service', $service);
                update_post_meta($post_id, '_reservation_date', $date);
                update_post_meta($post_id, '_reservation_heure', $heure);

                youbookpro_log("Réservation enregistrée : post_id=$post_id");

                wp_redirect(add_query_arg('booking', 'success', wp_get_referer()));
                exit;
            } else {
                youbookpro_log("Erreur d'insertion : " . $post_id->get_error_message());
            }

        } else {
            youbookpro_log("Champs manquants ou invalides");
        }
    }
}
add_action('init', 'youbookpro_handle_booking_form');
