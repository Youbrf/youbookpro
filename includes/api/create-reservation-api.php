<?php
add_action('rest_api_init', function() {
    register_rest_route('youbookpro/v1', '/reserve', [
        'methods' => 'POST',
        'callback' => 'youbookpro_handle_reservation',
        'permission_callback' => '__return_true',
        'args' => [
            'first_name' => ['required' => true, 'type' => 'string'],
            'last_name'  => ['required' => true, 'type' => 'string'],
            'email'      => ['required' => true, 'type' => 'string'],
            'phone'      => ['required' => true, 'type' => 'string'],
            'date'       => ['required' => true, 'type' => 'string'],
            'time'       => ['required' => true, 'type' => 'string'],
            'services'   => ['required' => true, 'type' => 'array'],
            'duration'   => ['required' => true, 'type' => 'integer'],
        ],
    ]);
});

function youbookpro_handle_reservation(WP_REST_Request $request) {
    $params = $request->get_json_params();

    $first_name = sanitize_text_field($params['first_name']);
    $last_name = sanitize_text_field($params['last_name']);
    $email = sanitize_email($params['email']);
    $phone = sanitize_text_field($params['phone']);
    $date = sanitize_text_field($params['date']);
    $time = sanitize_text_field($params['time']);
    $services = array_map('intval', $params['services']);
    $duration = intval($params['duration']);

    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Email invalide', ['status' => 400]);
    }

    $user = get_user_by('email', $email);

    if (!$user) {
        $random_password = wp_generate_password(12, false);
        $user_id = wp_create_user($email, $random_password, $email);

        if (is_wp_error($user_id)) {
            return new WP_Error('user_creation_failed', 'Erreur création utilisateur', ['status' => 500]);
        }

        wp_update_user([
            'ID' => $user_id,
            'first_name' => $first_name,
            'last_name' => $last_name,
            'role' => 'customer',
        ]);

        update_user_meta($user_id, 'phone', $phone);

        $user = get_user_by('ID', $user_id);
    } else {
        $user_id = $user->ID;
        update_user_meta($user_id, 'phone', $phone);
    }

    $reservation_data = [
        'post_title'   => 'Réservation de ' . $first_name . ' ' . $last_name,
        'post_type'    => 'youbook_reservation',
        'post_status'  => 'publish',
        'post_author'  => $user_id,
        'meta_input'   => [
            '_youbook_reservation_date'       => $date,
            '_youbook_reservation_time'       => $time,
            '_youbook_reservation_services'   => $services,
            '_youbook_reservation_duration'   => $duration,
            '_youbook_reservation_client_id'  => $user_id,
            '_youbook_reservation_employe_id' => $employe_id ?? null,
        ],
    ];

    $reservation_id = wp_insert_post($reservation_data);

    if (is_wp_error($reservation_id) || !$reservation_id) {
        return new WP_Error('reservation_creation_failed', 'Erreur création réservation', ['status' => 500]);
    }

    return [
        'success' => true,
        'message' => 'Réservation créée avec succès',
        'reservation_id' => $reservation_id,
        'user_id' => $user_id,
    ];
}
