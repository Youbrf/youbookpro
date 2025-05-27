<?php
if (!defined('ABSPATH')) exit;

add_action('rest_api_init', function () {
    register_rest_route('youbookpro/v1', '/reservations', [
        'methods' => 'GET',
        'callback' => 'youbookpro_get_reservations',
        'permission_callback' => '__return_true',
    ]);
});

function youbookpro_get_reservations(WP_REST_Request $request) {
    $date = sanitize_text_field($request->get_param('date')); 
    youbookpro_log("🔍 Date de réservation demandée : " . $date);

    $args = [
        'post_type' => 'youbook_reservation',
        'posts_per_page' => -1,
        'meta_query' => [
            [
                'key' => '_youbook_reservation_date',
                'value' => $date,
                'compare' => '='
            ]
        ]
    ];

    $query = new WP_Query($args);
    $reservations = [];

    youbookpro_log("📦 Nombre de réservations trouvées : " . count($query->posts));

    foreach ($query->posts as $post) {
        $reservation_id = $post->ID;
        $duration = get_post_meta($reservation_id, '_youbook_reservation_duration', true);
        $time     = get_post_meta($reservation_id, '_youbook_reservation_time', true);

        $reservations[] = [
            'id'       => $reservation_id,
            'time'     => $time,
            'duration' => intval($duration), // on force en int pour les calculs
        ];
    }


    youbookpro_log("✅ Résultat final envoyé à l'API : " . print_r($reservations, true));

    return $reservations;
}
