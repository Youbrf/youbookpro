<?php
if (!defined('ABSPATH')) exit;

/**
 * Enregistre le Custom Post Type "Réservation"
 */
function youbookpro_register_reservation_cpt() {
    $args = [
        'labels' => [
            'name'               => 'Réservations',
            'singular_name'      => 'Réservation',
            'add_new_item'       => 'Ajouter une réservation',
            'edit_item'          => 'Éditer la réservation',
            'all_items'          => 'Réservations',
            'view_item'          => 'Voir la réservation',
        ],
        'public'        => true,
        'show_in_menu'  => 'youbookpro_dashboard', // menu parent personnalisé
        'menu_icon'     => 'dashicons-calendar-alt',
        'supports'      => ['title'],
        'show_in_rest'  => true,
        'has_archive'   => false,
    ];
    register_post_type('youbook_reservation', $args);
}
add_action('init', 'youbookpro_register_reservation_cpt');



/**
 * Ajoute des colonnes personnalisées dans l’admin des réservations
 */
function youbookpro_set_custom_columns($columns) {
    unset($columns['date']); // Supprime la colonne date par défaut

    $columns['reservation_date']    = 'Date';
    $columns['reservation_time']    = 'Heure';
    $columns['reservation_client']  = 'Client';
    $columns['reservation_service'] = 'Service';
    $columns['reservation_employe'] = 'Employé';

    return $columns;
}
add_filter('manage_youbook_reservation_posts_columns', 'youbookpro_set_custom_columns');



/**
 * Affiche les données dans les colonnes personnalisées
 */
function youbookpro_custom_column_content($column, $post_id) {
    switch ($column) {
        case 'reservation_date':
            echo esc_html(get_post_meta($post_id, '_youbook_reservation_date', true));
            break;

        case 'reservation_time':
            echo esc_html(get_post_meta($post_id, '_youbook_reservation_time', true));
            break;

        case 'reservation_client':
            $client_id = get_post_meta($post_id, '_youbook_reservation_client_id', true);
            if ($client_id && get_post_status($client_id) === 'publish') {
                echo '<a href="' . esc_url(get_edit_post_link($client_id)) . '">' . esc_html(get_the_title($client_id)) . '</a>';
            } else {
                echo '<em>Non assigné</em>';
            }
            break;

        case 'reservation_employe':
            $employe_id = get_post_meta($post_id, '_youbook_reservation_employe_id', true);
            if ($employe_id && get_post_status($employe_id) === 'publish') {
                echo '<a href="' . esc_url(get_edit_post_link($employe_id)) . '">' . esc_html(get_the_title($employe_id)) . '</a>';
            } else {
                echo '<em>Non assigné</em>';
            }
            break;

        case 'reservation_service':
            $service = get_post_meta($post_id, '_youbook_reservation_service', true);
            echo esc_html($service) ?: '<em>Non assigné</em>';
            break;
    }
}
add_action('manage_youbook_reservation_posts_custom_column', 'youbookpro_custom_column_content', 10, 2);



/**
 * Rendre certaines colonnes triables (optionnel)
 */
function youbookpro_sortable_columns($columns) {
    $columns['reservation_date']    = 'reservation_date';
    $columns['reservation_time']    = 'reservation_time';
    $columns['reservation_client']  = 'reservation_client';
    $columns['reservation_employe'] = 'reservation_employe';
    return $columns;
}
add_filter('manage_edit-youbook_reservation_sortable_columns', 'youbookpro_sortable_columns');
