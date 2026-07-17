<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter([
        'http://localhost:3000',  // Next.js dev
        'http://localhost:3001',  // Next.js dev (fallback port)
        'https://*.ngrok-free.app',  // Allow ngrok
        env('FRONTEND_URL'),  // Production frontend (e.g. Vercel)
    ]),

    'allowed_origins_patterns' => [
        '#^http://localhost:\d+$#',  // Any localhost port for local dev
        '#^https://.*\.ngrok-free\.app$#',  // Pattern for ngrok
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,  // Important for cookies
];
