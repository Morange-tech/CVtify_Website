<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: "CVtify API",
    version: "1.0.0",
    description: "API for CVtify - Create professional CVs and Cover Letters",
    contact: new OA\Contact(
        name: "CVtify Support",
        email: "support@cvtify.com"
    )
)]
#[OA\Server(
    url: "http://localhost:8000/api",
    description: "Local Development Server"
)]
#[OA\Server(
    url: "https://your-ngrok-url.ngrok-free.app/api",
    description: "ngrok Public Server"
)]
#[OA\SecurityScheme(
    securityScheme: "sanctum",
    type: "apiKey",
    in: "header",
    name: "Authorization",
    description: "Enter your token (e.g., Token your-token-here)"
)]
#[OA\Tag(name: "Authentication", description: "Auth endpoints")]
#[OA\Tag(name: "User", description: "User endpoints")]
#[OA\Tag(name: "CVs", description: "CV endpoints")]
#[OA\Tag(name: "Templates", description: "Template endpoints")]
abstract class Controller
{
    //
}
