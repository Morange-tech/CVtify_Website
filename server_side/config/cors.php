<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',  // Next.js dev
        'https://*.ngrok-free.app',  // Allow ngrok
    ],

    'allowed_origins_patterns' => [
        '#^https://.*\.ngrok-free\.app$#',  // Pattern for ngrok
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,  // Important for cookies
];
