<?php
if (!defined('ABSPATH')) exit;

function youbookpro_register_custom_menu_page() {
    add_menu_page(
        'YouBookPro',                // Titre de la page
        'YouBookPro',                // Titre du menu
        'manage_options',            // Capabilité
        'youbookpro_dashboard',      // Slug
        '',                          // Pas de fonction de contenu ici
        'dashicons-calendar-alt',    // Icône
        5                            // Position
    );
}
add_action('admin_menu', 'youbookpro_register_custom_menu_page');
