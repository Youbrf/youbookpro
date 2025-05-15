<?php
// Sécurité : empêche l'accès direct
if (!defined('ABSPATH')) exit;

add_action('wp_ajax_youbookpro_create_reservation', 'youbookpro_create_reservation_callback');
add_action('wp_ajax_nopriv_youbookpro_create_reservation', 'youbookpro_create_reservation_callback');

function youbookpro_create_reservation_callback() {
    // Optionnel : log les données entrantes pour déboguer
    error_log('Données reçues : ' . print_r($_POST, true));

    // Validation minimale
    if (
        empty($_POST['client_name']) || 
        empty($_POST['client_email']) || 
        empty($_POST['services']) || 
        empty($_POST['date']) || 
        empty($_POST['time'])
    ) {
        wp_send_json_error(['message' => 'Champs manquants.']);
        return;
    }

    $client_name     = sanitize_text_field($_POST['client_name']);
    $client_email    = sanitize_email($_POST['client_email']);
    $client_phone    = sanitize_text_field($_POST['client_phone']);
    $payment_method  = sanitize_text_field($_POST['payment_method']);
    $date            = sanitize_text_field($_POST['date']);
    $time            = sanitize_text_field($_POST['time']);
    $services        = json_decode(stripslashes($_POST['services']), true);

    if (!is_array($services)) {
        wp_send_json_error(['message' => 'Erreur de format des services.']);
        return;
    }

    // Recherche d'un client existant
    $existing_client = get_posts([
        'post_type'  => 'youbook_client',
        'meta_key'   => '_youbook_client_email',
        'meta_value' => $client_email,
        'numberposts' => 1,
    ]);

    if (!empty($existing_client)) {
        $client_id = $existing_client[0]->ID;
    } else {
        $client_id = wp_insert_post([
            'post_type'   => 'youbook_client',
            'post_title'  => $client_name,
            'post_status' => 'publish',
        ]);
        if (is_wp_error($client_id)) {
            wp_send_json_error(['message' => 'Erreur lors de la création du client.']);
        }

        update_post_meta($client_id, '_youbook_client_email', $client_email);
        update_post_meta($client_id, '_youbook_client_phone', $client_phone);
    }

    // Création de la réservation
    $reservation_id = wp_insert_post([
        'post_type'   => 'youbook_reservation',
        'post_title'  => "Réservation de $client_name",
        'post_status' => 'publish',
    ]);

    if (is_wp_error($reservation_id)) {
        wp_send_json_error(['message' => 'Erreur lors de la création de la réservation.']);
    }

    update_post_meta($reservation_id, '_youbook_reservation_client_id', $client_id);
    update_post_meta($reservation_id, '_youbook_reservation_services', $services);
    update_post_meta($reservation_id, '_youbook_reservation_date', $date);
    update_post_meta($reservation_id, '_youbook_reservation_time', $time);
    update_post_meta($reservation_id, '_youbook_reservation_payment_method', $payment_method);

    wp_send_json_success([
        'message' => 'Réservation créée avec succès.',
        'reservation_id' => $reservation_id,
    ]);
}
