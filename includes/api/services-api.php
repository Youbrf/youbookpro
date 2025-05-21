<?php
if (!defined('ABSPATH')) exit;

/**
 * Enregistre la route REST pour obtenir les services
 */
add_action('rest_api_init', function () {
    register_rest_route('youbookpro/v1', '/services', [
        'methods'  => 'GET',
        'callback' => 'youbookpro_get_services',
        'permission_callback' => '__return_true', // accessible publiquement
    ]);
});

/**
 * Callback pour retourner les services
 */
function youbookpro_get_services() {
    $services = get_posts([
        'post_type'      => 'youbook_service',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
    ]);

    $data = [];

    foreach ($services as $service) {
        $id = $service->ID;
        $price = get_post_meta($id, '_youbookpro_price', true);
        $duration = get_post_meta($id, '_youbookpro_duration', true);
        $category_id = get_post_meta($id, '_youbookpro_categorie', true);
        $category_name = $category_id ? get_the_title($category_id) : '';

        $data[] = [
            'id'       => $id,
            'title'    => get_the_title($id),
            'price'    => $price,
            'duration' => $duration,
            'category' => [
                'id'   => $category_id,
                'name' => $category_name
            ],
        ];
    }

    return rest_ensure_response($data);
}
