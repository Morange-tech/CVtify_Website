<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class LinkedInAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('linkedin')
            ->stateless()
            ->scopes(['openid', 'profile', 'email'])
            ->redirect();
    }

public function callback(Request $request)
{
    // LinkedIn may return ?error=... instead of code
    if (!$request->has('code')) {
        return view('linkedin.callback', [
            'payload' => [
                'linkedinError' => $request->query(), // contains error + error_description
            ],
            'frontendOrigin' => env('FRONTEND_URL', 'http://localhost:3000'),
        ]);
    }

    try {
        $user = Socialite::driver('linkedin')->stateless()->user();
    } catch (\Throwable $e) {
        return view('linkedin.callback', [
            'payload' => [
                'linkedinError' => ['message' => $e->getMessage()],
            ],
            'frontendOrigin' => env('FRONTEND_URL', 'http://localhost:3000'),
        ]);
    }

    $raw = $user->user ?? [];

    // Option A: avatar -> base64
    $base64Avatar = null;
    try {
        if (!empty($user->avatar)) {
            $resp = \Illuminate\Support\Facades\Http::timeout(10)->get($user->avatar);
            if ($resp->successful()) {
                $mime = $resp->header('Content-Type') ?: 'image/jpeg';
                $base64Avatar = 'data:'.$mime.';base64,'.base64_encode($resp->body());
            }
        }
    } catch (\Throwable $e) {
        // ignore avatar failure
    }

    return view('linkedin.callback', [
        'payload' => [
            'personalInfo' => [
                'firstName' => $raw['localizedFirstName'] ?? '',
                'lastName'  => $raw['localizedLastName'] ?? '',
                'email'     => $user->email ?? '',
                'profileImage' => $base64Avatar,
            ],
        ],
        'frontendOrigin' => env('FRONTEND_URL', 'http://localhost:3000'),
    ]);
}
}
