<?php
    define('RUTA_ADMIN', dirname(__FILE__).'/admin');
    define('RUTA_SETTINGS', dirname(__FILE__).'/Settings');

    $base_url = ( empty( $_SERVER['HTTPS'] ) OR strtolower( $_SERVER['HTTPS'] ) === 'off' ) ? 'http' : 'https';
    $base_url .= '://'. $_SERVER['HTTP_HOST'];
    define('URL',  $base_url.'/Sistema Base') ;
?>