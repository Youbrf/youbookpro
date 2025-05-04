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
        'supports' => ['title', 'custom-fields'],
        'show_in_rest' => true,
        'has_archive' => true,
        'show_in_menu' => 'youbookpro_dashboard',
    ];
    register_post_type('youbook_reservation', $args);
}
add_action('init', 'youbookpro_register_reservation_cpt');
