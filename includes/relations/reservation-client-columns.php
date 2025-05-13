<?php
if (!defined('ABSPATH')) exit;

// Ajoute une colonne "Client" dans l'admin des réservations
function youbookpro_add_client_column_to_reservations($columns) {
    $columns['youbook_client'] = 'Client';
    return $columns;
}
add_filter('manage_youbook_reservation_posts_columns', 'youbookpro_add_client_column_to_reservations');

// Affiche le client dans la colonne
function youbookpro_show_client_column_in_reservations($column, $post_id) {
    if ($column === 'youbook_client') {
        $client_id = get_post_meta($post_id, 'youbook_client_id', true);
        if ($client_id) {
            $client_title = get_the_title($client_id);
            echo esc_html($client_title);
        } else {
            echo '<em>Aucun</em>';
        }
    }
}
add_action('manage_youbook_reservation_posts_custom_column', 'youbookpro_show_client_column_in_reservations', 10, 2);
