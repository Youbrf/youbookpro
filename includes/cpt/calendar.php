<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Ajoute un sous‑menu “Calendrier” sous Réservations
 */
function youbookpro_add_reservation_calendar_submenu() {
    youbookpro_log( 'Hook admin_menu : on entre dans add_reservation_calendar_submenu' );
    add_submenu_page(
        'youbookpro_dashboard', // parent (liste Réservation)
        'Calendrier',                             // titre de la page
        'Calendrier',                             // intitulé du sous‑menu
        'manage_options',                         // capacité requise
        'youbookpro_reservation_calendar',        // slug
        'youbookpro_render_reservation_calendar'  // callback d’affichage
    );
}
add_action( 'admin_menu', 'youbookpro_add_reservation_calendar_submenu' );

/**
 * Callback d’affichage du calendrier
 */
function youbookpro_render_reservation_calendar() {
    youbookpro_log( 'Rendu du sous-menu Calendrier : on entre dans render_reservation_calendar' );
    ?>
    <div class="wrap">
      <h1>Calendrier des Réservations</h1>
      <div id="calendar" style="background:#fff;border:1px solid #ddd;padding:10px;"></div>
    </div>
    <?php
}

function enqueue_calendar_assets($hook) {
    // Vérifiez si nous sommes sur la bonne page d'administration
    if ($hook !== 'youbookpro_page_youbookpro_reservation_calendar') {
        return;
    }

    // Enregistrement et en file d'attente de FullCalendar
    wp_register_script(
        'fullcalendar',
        'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.17/index.global.min.js',
        array(),
        '6.1.17',
        true
    );
    wp_enqueue_script('fullcalendar');
    youbookpro_log('Script FullCalendar en file d\'attente');

    // Enregistrement et en file d'attente de votre script d'initialisation
    wp_register_script(
        'calendar-init',
        plugin_dir_url(__FILE__) . '../../assets/js/calendar-init.js',
        array('fullcalendar'),
        '1.0.0',
        true
    );
    wp_enqueue_script('calendar-init');
	wp_localize_script('calendar-init', 'ajaxurl', admin_url('admin-ajax.php'));
    youbookpro_log('Script calendar-init.js en file d\'attente');

}
add_action('admin_enqueue_scripts', 'enqueue_calendar_assets');

function youbookpro_get_reservations() {
    $args = array(
        'post_type' => 'youbook_reservation',
        'posts_per_page' => -1,
        'post_status' => 'publish',
    );

    $reservations = get_posts($args);
    $events = [];

    foreach ($reservations as $reservation) {
        $date = get_post_meta($reservation->ID, '_youbook_reservation_date', true);
        $time = get_post_meta($reservation->ID, '_youbook_reservation_time', true);
        $client_id = get_post_meta($reservation->ID, '_youbook_reservation_client_id', true);
        $client_name = $client_id ? get_the_title($client_id) : 'Client inconnu';

        if ($date && $time) {
            $events[] = [
                'id' => $reservation->ID,
                'title' => get_the_title($reservation) . ' - ' . $client_name,
                'start' => $date . 'T' . $time,
                'allDay' => false
            ];
        }
    }

    wp_send_json($events);
}
add_action('wp_ajax_youbookpro_get_reservations', 'youbookpro_get_reservations');

