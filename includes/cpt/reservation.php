<?php
if (!defined('ABSPATH')) exit;

function youbookpro_register_reservation_cpt() {
    $args = [
        'labels' => [
            'name' => 'Réservations',
            'singular_name' => 'Réservation',
            'add_new_item' => 'Ajouter une réservation',
            'edit_item' => 'Éditer la réservation',
            'all_items' => 'Toutes les réservations',
            'view_item' => 'Voir la réservation',
        ],
        'public' => true,
        'show_in_menu' => true,
        'menu_icon' => 'dashicons-calendar-alt',
        'supports' => ['title','custom-fields'],
        'show_in_rest' => true,
        'has_archive' => true,
        'show_in_menu' => 'youbookpro_dashboard',
    ];
    register_post_type('youbook_reservation', $args);
}
add_action('init', 'youbookpro_register_reservation_cpt');

// Ajouter des colonnes personnalisées à la liste des réservations
add_filter('manage_youbook_reservation_posts_columns', 'youbookpro_set_custom_columns');
function youbookpro_set_custom_columns($columns) {
    unset($columns['date']);

    $columns['reservation_date'] = 'Date';
    $columns['reservation_time'] = 'Heure';
    $columns['reservation_client'] = 'Client';
    $columns['reservation_service'] = 'Service';
    $columns['reservation_employe'] = 'Employé';

    return $columns;
}

// Remplir les colonnes avec les données personnalisées
add_action('manage_youbook_reservation_posts_custom_column', 'youbookpro_custom_column_content', 10, 2);
function youbookpro_custom_column_content($column, $post_id) {
    switch ($column) {
        case 'reservation_date':
            echo esc_html(get_post_meta($post_id, '_reservation_date', true));
            break;

        case 'reservation_time':
            echo esc_html(get_post_meta($post_id, '_reservation_heure', true));
            break;

        case 'reservation_client':
            $nom = get_post_meta($post_id, '_reservation_nom', true);
            $prenom = get_post_meta($post_id, '_reservation_prenom', true);
            echo esc_html($prenom . ' ' . $nom);
            break;

        case 'reservation_service':
            echo esc_html(get_post_meta($post_id, '_reservation_service', true));
            break;

        case 'reservation_employe':
            echo esc_html(get_post_meta($post_id, '_reservation_employe', true));
            break;
    }
}

// Rendre certaines colonnes triables (facultatif)
add_filter('manage_edit-youbook_reservation_sortable_columns', 'youbookpro_sortable_columns');
function youbookpro_sortable_columns($columns) {
    $columns['reservation_date'] = 'reservation_date';
    $columns['reservation_time'] = 'reservation_time';
    $columns['reservation_client'] = 'reservation_client';
    $columns['reservation_employe'] = 'reservation_employe';
    return $columns;
}
