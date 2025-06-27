<?php
$wrapper_attributes = get_block_wrapper_attributes();

$button_color = $attributes['buttonColor'] ?? '#0073aa';
$button_text_color = $attributes['buttonTextColor'] ?? '#ffffff';
$button_hover_color = $attributes['buttonHoverColor'] ?? '#005177';
$button_hover_text_color = $attributes['buttonHoverTextColor'] ?? '#ffffff';

echo '<div ' . $wrapper_attributes . '>';
echo '<div id="youbookpro-booking-root" '
    . ' data-button-color="' . esc_attr($button_color) . '"'
    . ' data-button-text-color="' . esc_attr($button_text_color) . '"'
    . ' data-button-hover-color="' . esc_attr($button_hover_color) . '"'
    . ' data-button-hover-text-color="' . esc_attr($button_hover_text_color) . '">'
    . 'Chargement…</div>';
echo '</div>';
