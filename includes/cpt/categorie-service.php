<?php
if (!defined('ABSPATH')) exit;

/**
 * Enregistre le Custom Post Type "Catégorie de service"
 */
function youbookpro_register_categorie_service_cpt() {
    $labels = [
        'name'               => 'Catégories de services',
        'singular_name'      => 'Catégorie de service',
        'menu_name'          => 'Catégories de services',
        'name_admin_bar'     => 'Catégorie de service',
        'add_new'            => 'Ajouter',
        'add_new_item'       => 'Ajouter une nouvelle catégorie',
        'edit_item'          => 'Éditer la catégorie',
        'new_item'           => 'Nouvelle catégorie',
        'view_item'          => 'Voir la catégorie',
        'view_items'         => 'Voir les catégories',
        'search_items'       => 'Rechercher une catégorie',
        'not_found'          => 'Aucune catégorie trouvée',
        'all_items'          => 'Catégories',
    ];

    $args = [
        'labels'             => $labels,
        'public'             => true,
        'show_in_menu'       => 'youbookpro_dashboard',
        'menu_icon'          => 'dashicons-category',
        'supports'           => ['title'],
        'has_archive'        => false,
        'show_in_rest'       => true, 
        'capability_type'    => 'post',
    ];

    register_post_type('youbook_categorie', $args);
}
add_action('init', 'youbookpro_register_categorie_service_cpt');
