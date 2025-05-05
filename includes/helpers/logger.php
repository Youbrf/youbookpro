<?php
function youbookpro_log($message) {
    if (is_array($message) || is_object($message)) {
        $message = print_r($message, true);
    }
    $log_file = plugin_dir_path(__DIR__) . '../debug.log';
    error_log(date('[Y-m-d H:i:s] ') . $message . PHP_EOL, 3, $log_file);
}
