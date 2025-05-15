<?php
if (!defined('ABSPATH')) exit;

function youbookpro_register_client_cpt() {
    $args = [
        'labels' => [
            'name' => 'Clients',
            'singular_name' => 'Client',
            'add_new_item' => 'Ajouter un client',
            'edit_item' => 'Éditer le client',
            'all_items' => 'Clients',
            'view_item' => 'Voir le client',
        ],
        'public' => true,
        'show_in_menu' => true,
        'menu_icon' => 'dashicons-id',
        'supports' => ['title'],
        'show_in_rest' => true,
        'has_archive' => true,
        'show_in_menu' => 'youbookpro_dashboard',
    ];
    register_post_type('youbook_client', $args);
}
add_action('init', 'youbookpro_register_client_cpt');
