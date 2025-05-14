<?php
if (!defined('ABSPATH')) exit;

/**
 * Enregistre le Custom Post Type "Service"
 */
function youbookpro_register_service_cpt() {
    $labels = [
        'name'               => 'Services',
        'singular_name'      => 'Service',
        'menu_name'          => 'Services',
        'name_admin_bar'     => 'Service',
        'add_new'            => 'Ajouter',
        'add_new_item'       => 'Ajouter un nouveau service',
        'edit_item'          => 'Éditer le service',
        'new_item'           => 'Nouveau service',
        'view_item'          => 'Voir le service',
        'view_items'         => 'Voir les services',
        'search_items'       => 'Rechercher un service',
        'not_found'          => 'Aucun service trouvé',
        'not_found_in_trash' => 'Aucun service dans la corbeille',
        'all_items'          => 'Services',
    ];

    $args = [
        'labels'             => $labels,
        'public'             => true,
        'show_in_menu'       => 'youbookpro_dashboard',
        'menu_icon'          => 'dashicons-hammer',
        'supports'           => ['title'], // on ne garde que le titre
        'has_archive'        => true,
        'show_in_rest'       => true,
        'capability_type'    => 'post',
        'rewrite'            => ['slug' => 'services'],
    ];

    register_post_type('youbook_service', $args);
}
add_action('init', 'youbookpro_register_service_cpt');

/**
 * Ajoute les champs prix et durée dans l'éditeur de service
 */
function youbookpro_add_service_meta_box() {
    add_meta_box(
        'youbookpro_service_fields',
        'Détails du service',
        'youbookpro_render_service_fields',
        'youbook_service',
        'normal',
        'default'
    );
}
add_action('add_meta_boxes', 'youbookpro_add_service_meta_box');

/**
 * Affiche les champs prix et durée
 */
function youbookpro_render_service_fields($post) {
    $price = get_post_meta($post->ID, '_youbookpro_price', true);
    $duration = get_post_meta($post->ID, '_youbookpro_duration', true);
    wp_nonce_field('youbookpro_save_service_fields', 'youbookpro_service_nonce');

    echo '<p><label for="youbookpro_price">Prix (€) :</label><br />';
    echo '<input type="number" step="0.01" name="youbookpro_price" value="' . esc_attr($price) . '" /></p>';

    echo '<p><label for="youbookpro_duration">Durée (en minutes) :</label><br />';
    echo '<input type="number" name="youbookpro_duration" value="' . esc_attr($duration) . '" /></p>';
}

/**
 * Sauvegarde des champs prix et durée
 */
function youbookpro_save_service_fields($post_id) {
    if (!isset($_POST['youbookpro_service_nonce']) || !wp_verify_nonce($_POST['youbookpro_service_nonce'], 'youbookpro_save_service_fields')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    if (isset($_POST['youbookpro_price'])) {
        update_post_meta($post_id, '_youbookpro_price', sanitize_text_field($_POST['youbookpro_price']));
    }

    if (isset($_POST['youbookpro_duration'])) {
        update_post_meta($post_id, '_youbookpro_duration', sanitize_text_field($_POST['youbookpro_duration']));
    }
}
add_action('save_post', 'youbookpro_save_service_fields');

/**
 * Ajoute un champ de sélection de catégorie dans le CPT "Service"
 */
function youbookpro_add_categorie_field() {
    add_meta_box(
        'youbookpro_categorie',
        'Catégorie du service',
        'youbookpro_render_categorie_field',
        'youbook_service',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'youbookpro_add_categorie_field');

/**
 * Affiche le champ de sélection de catégorie
 */
function youbookpro_render_categorie_field($post) {
    $categories = get_posts([
        'post_type' => 'youbook_categorie',
        'posts_per_page' => -1,
        'fields' => 'ids',
    ]);
    
    $selected_category = get_post_meta($post->ID, '_youbookpro_categorie', true);
    wp_nonce_field('youbookpro_save_categorie', 'youbookpro_categorie_nonce');

    echo '<p><label for="youbookpro_categorie">Catégorie :</label><br />';
    echo '<select name="youbookpro_categorie" id="youbookpro_categorie">';
    echo '<option value="">Sélectionner une catégorie</option>';
    
    foreach ($categories as $category) {
        $category_name = get_the_title($category);
        echo '<option value="' . $category . '" ' . selected($selected_category, $category, false) . '>' . esc_html($category_name) . '</option>';
    }
    
    echo '</select></p>';
}

/**
 * Sauvegarde le champ de catégorie pour chaque service
 */
function youbookpro_save_categorie($post_id) {
    if (!isset($_POST['youbookpro_categorie_nonce']) || !wp_verify_nonce($_POST['youbookpro_categorie_nonce'], 'youbookpro_save_categorie')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    if (isset($_POST['youbookpro_categorie'])) {
        update_post_meta($post_id, '_youbookpro_categorie', sanitize_text_field($_POST['youbookpro_categorie']));
    }
}
add_action('save_post', 'youbookpro_save_categorie');

/**
 * Ajoute une colonne "Catégorie" dans la liste des services
 */
function youbookpro_add_service_columns($columns) {
    $columns['youbookpro_categorie'] = 'Catégorie';
    return $columns;
}
add_filter('manage_youbook_service_posts_columns', 'youbookpro_add_service_columns');

/**
 * Affiche la valeur de la catégorie dans la colonne personnalisée
 */
function youbookpro_render_service_columns($column, $post_id) {
    if ($column === 'youbookpro_categorie') {
        $category_id = get_post_meta($post_id, '_youbookpro_categorie', true);
        echo $category_id ? esc_html(get_the_title($category_id)) : '<em>Aucune</em>';
    }
}
add_action('manage_youbook_service_posts_custom_column', 'youbookpro_render_service_columns', 10, 2);

/**
 * Rend la colonne "Catégorie" triable dans la liste des services
 */
function youbookpro_make_category_column_sortable($columns) {
    $columns['youbookpro_categorie'] = 'youbookpro_categorie';
    return $columns;
}
add_filter('manage_edit-youbook_service_sortable_columns', 'youbookpro_make_category_column_sortable');

/**
 * Modifie la requête pour trier par catégorie de service
 */
function youbookpro_sort_by_category_column($query) {
    // Ne s'applique que dans l'admin, pour le CPT service, sur la bonne colonne
    if (!is_admin() || !$query->is_main_query()) return;

    if ($query->get('orderby') === 'youbookpro_categorie') {
        $query->set('meta_key', '_youbookpro_categorie');
        $query->set('orderby', 'meta_value');
    }
}
add_action('pre_get_posts', 'youbookpro_sort_by_category_column');
