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

    // Enregistrement et en file d'attente de Bootstrap 5 CSS
    wp_register_style(
        'bootstrap5-css',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
        array(),
        '5.3.0'
    );
    wp_enqueue_style('bootstrap5-css');

    // Enregistrement et en file d'attente de Bootstrap Icons
    wp_register_style(
        'bootstrap-icons',
        'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css',
        array(),
        '1.8.1'
    );
    wp_enqueue_style('bootstrap-icons');

    // Enregistrement et en file d'attente de FullCalendar
    wp_register_script(
        'fullcalendar',
        'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.17/index.global.min.js',
        array(),
        '6.1.17',
        true
    );
    wp_enqueue_script('fullcalendar');

    // Enregistrement et en file d'attente du plugin Bootstrap 5 pour FullCalendar
    wp_register_script(
        'fullcalendar-bootstrap5',
        'https://cdn.jsdelivr.net/npm/@fullcalendar/bootstrap5@6.1.8/index.global.min.js',
        array('fullcalendar'),
        '6.1.8',
        true
    );
    wp_enqueue_script('fullcalendar-bootstrap5');

    // Enregistrement et en file d'attente de votre script d'initialisation
    wp_register_script(
        'calendar-init',
        plugin_dir_url(__FILE__) . '../../assets/js/calendar-init.js',
        array('fullcalendar', 'fullcalendar-bootstrap5'),
        '1.0.0',
        true
    );
    wp_enqueue_script('calendar-init');

    // Localisation du script pour passer des variables PHP à JavaScript
    wp_localize_script('calendar-init', 'ajaxurl', admin_url('admin-ajax.php'));
}
add_action('admin_enqueue_scripts', 'enqueue_calendar_assets');


function youbookpro_get_reservations_calendar() {
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
        $duration_minutes = get_post_meta($reservation->ID, '_youbook_reservation_duration', true);
        $client_id = get_post_meta($reservation->ID, '_youbook_reservation_client_id', true);
        $user = get_userdata($client_id);

        if ($user) {
            $name = trim($user->first_name . ' ' . $user->last_name);
            if (empty($name)) {
                $name = $user->display_name;
            }
        } else {
            $name = 'Client inconnu';
        }

        if ($date && $time && $duration_minutes) {
            $start_datetime = new DateTime($date . ' ' . $time);
            $end_datetime = clone $start_datetime;
            $end_datetime->modify("+{$duration_minutes} minutes");

            $events[] = [
                'id' => $reservation->ID,
                'title' => $name,
                'start' => $start_datetime->format('c'),
                'end' => $end_datetime->format('c'),
                'allDay' => false
            ];
        }
    }

    wp_send_json($events);
}
add_action('wp_ajax_youbookpro_get_reservations', 'youbookpro_get_reservations_calendar');



