<?php
if (!defined('ABSPATH')) exit;

// Ajoute une colonne "Employé" dans l'admin des services
function youbookpro_add_employe_column_to_services($columns) {
    $columns['youbook_employe'] = 'Employé';
    return $columns;
}
add_filter('manage_youbook_service_posts_columns', 'youbookpro_add_employe_column_to_services');

// Affiche l'employé dans la colonne
function youbookpro_show_employe_column_in_services($column, $post_id) {
    if ($column === 'youbook_employe') {
        $employe_id = get_post_meta($post_id, 'youbook_employe_id', true);
        if ($employe_id) {
            echo esc_html(get_the_title($employe_id));
        } else {
            echo '<em>Non assigné</em>';
        }
    }
}
add_action('manage_youbook_service_posts_custom_column', 'youbookpro_show_employe_column_in_services', 10, 2);
