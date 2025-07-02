<?php
if (!defined('ABSPATH')) exit;

add_action('rest_api_init', function () {
    register_rest_route('youbookpro/v1', '/current-user', [
        'methods'  => 'GET',
        'callback' => function (WP_REST_Request $request) {
            if (!is_user_logged_in()) {
                return new WP_Error('rest_forbidden', 'Non connecté', ['status' => 401]);
            }
            $user = wp_get_current_user();
            return [
                'ID'        => $user->ID,
                'user_login'=> $user->user_login,
                'user_email'=> $user->user_email,
                'display_name' => $user->display_name,
            ];
        },
        'permission_callback' => function () {
            return is_user_logged_in();
        }
    ]);
});
