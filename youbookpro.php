<?php
/**
 * Plugin Name:       Youbookpro
 * Description:       Example block scaffolded with Create Block tool.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       youbookpro
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require_once plugin_dir_path(__FILE__) . 'includes/helpers/logger.php';


// Inclure les CPT
require_once plugin_dir_path(__FILE__) . 'includes/cpt/admin-menu.php';
require_once plugin_dir_path(__FILE__) . 'includes/cpt/reservation.php';
require_once plugin_dir_path(__FILE__) . 'includes/cpt/client.php';
require_once plugin_dir_path(__FILE__) . 'includes/cpt/service.php';
require_once plugin_dir_path(__FILE__) . 'includes/cpt/employe.php';

require_once plugin_dir_path(__FILE__) . 'includes/form-handler.php';

// Enqueue JS/CSS
function youbookpro_enqueue_assets() {
    wp_enqueue_style('flatpickr-css', 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css');
    wp_enqueue_style('youbookpro-form', plugin_dir_url(__FILE__) . 'assets/css/booking-form.css');
    wp_enqueue_script('flatpickr-js', 'https://cdn.jsdelivr.net/npm/flatpickr', [], false, true);
    wp_enqueue_script('youbookpro-form', plugin_dir_url(__FILE__) . 'assets/js/booking-form.js', ['jquery', 'flatpickr-js'], false, true);
}
add_action('wp_enqueue_scripts', 'youbookpro_enqueue_assets');

// Shortcode pour afficher le formulaire
function youbookpro_booking_form_shortcode() {
    ob_start();
    include plugin_dir_path(__FILE__) . 'templates/booking-form.php';
    return ob_get_clean();
}
add_shortcode('youbookpro_booking_form', 'youbookpro_booking_form_shortcode');


/**
 * Registers the block using a `blocks-manifest.php` file, which improves the performance of block type registration.
 * Behind the scenes, it also registers all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function create_block_youbookpro_block_init() {
	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
	 * based on the registered block metadata.
	 * Added in WordPress 6.8 to simplify the block metadata registration process added in WordPress 6.7.
	 *
	 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
	 */
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
		return;
	}

	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` file.
	 * Added to WordPress 6.7 to improve the performance of block type registration.
	 *
	 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
	 */
	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}
	/**
	 * Registers the block type(s) in the `blocks-manifest.php` file.
	 *
	 * @see https://developer.wordpress.org/reference/functions/register_block_type/
	 */
	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( __DIR__ . "/build/{$block_type}" );
	}
}
add_action( 'init', 'create_block_youbookpro_block_init' );
