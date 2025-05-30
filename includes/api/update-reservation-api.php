<?php
function youbookpro_update_reservation() {
    if (!isset($_POST['id'], $_POST['start'])) {
        wp_send_json_error('Données manquantes');
    }

    $post_id = intval($_POST['id']);
    $start_raw = sanitize_text_field($_POST['start']);

    $start = new DateTime($start_raw);

    $duration = get_post_meta($post_id, '_youbook_reservation_duration', true);

    $end = clone $start;
    $end->modify("+$duration minutes");

    update_post_meta($post_id, '_youbook_reservation_date', $start->format('Y-m-d'));
    update_post_meta($post_id, '_youbook_reservation_time', $start->format('H:i'));

    wp_send_json_success([
        'start' => $start->format(DateTime::ATOM),
        'end'   => $end->format(DateTime::ATOM)
    ]);
}
add_action('wp_ajax_youbookpro_update_reservation', 'youbookpro_update_reservation');
