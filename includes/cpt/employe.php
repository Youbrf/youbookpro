<?php
if (!defined('ABSPATH')) exit;

function youbookpro_register_employe_cpt() {
    $args = [
        'labels' => [
            'name' => 'Employés',
            'singular_name' => 'Employé',
            'add_new_item' => 'Ajouter un employé',
            'edit_item' => 'Éditer l\'employé',
            'all_items' => 'Tous les employés',
            'view_item' => 'Voir l\'employé',
        ],
        'public' => true,
        'show_in_menu' => true,
        'menu_icon' => 'dashicons-businessperson',
        'supports' => ['title', 'custom-fields'],
        'show_in_rest' => true,
        'has_archive' => true,
        'show_in_menu' => 'youbookpro_dashboard',
    ];
    register_post_type('youbook_employe', $args);
}
add_action('init', 'youbookpro_register_employe_cpt');
