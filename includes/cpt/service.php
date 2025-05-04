<?php
if (!defined('ABSPATH')) exit;

function youbookpro_register_service_cpt() {
    $args = [
        'labels' => [
            'name' => 'Services',
            'singular_name' => 'Service',
            'add_new_item' => 'Ajouter un service',
            'edit_item' => 'Éditer le service',
            'all_items' => 'Tous les services',
            'view_item' => 'Voir le service',
        ],
        'public' => true,
        'show_in_menu' => true,
        'menu_icon' => 'dashicons-hammer',
        'supports' => ['title', 'editor', 'custom-fields'],
        'show_in_rest' => true,
        'has_archive' => true,
        'show_in_menu' => 'youbookpro_dashboard',
    ];
    register_post_type('youbook_service', $args);
}
add_action('init', 'youbookpro_register_service_cpt');
