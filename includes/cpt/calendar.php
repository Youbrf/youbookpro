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
    youbookpro_log('Script calendar-init.js en file d\'attente');

}
add_action('admin_enqueue_scripts', 'enqueue_calendar_assets');



