<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeEmail;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;
use OpenApi\Attributes as OA;


class AuthController extends Controller
{
    #[OA\Post(
        path: "/register",
        summary: "Register a new user",
        tags: ["Authentication"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name", "email", "password", "password_confirmation"],
                properties: [
                    new OA\Property(property: "name", type: "string", example: "John Doe"),
                    new OA\Property(property: "email", type: "string", format: "email", example: "john@example.com"),
                    new OA\Property(property: "password", type: "string", format: "password", example: "password123"),
                    new OA\Property(property: "password_confirmation", type: "string", format: "password", example: "password123"),
                    
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Registration successful"),
            new OA\Response(response: 422, description: "Validation error")
        ]
    )]
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'plan' => 'free',
            'subscription_status' => 'inactive',
        ]);

        event(new Registered($user));

        // Send welcome email
        Mail::to($user->email)->send(new WelcomeEmail($user));

        // Create token for API
        $token = $user->createToken('auth_token')->plainTextToken;


        // Auth::login($user);

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    #[OA\Post(
        path: "/login",
        summary: "Login user",
        tags: ["Authentication"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["email", "password"],
                properties: [
                    new OA\Property(property: "email", type: "string", format: "email", example: "john@example.com"),
                    new OA\Property(property: "password", type: "string", format: "password", example: "password123"),
                    new OA\Property(property: "remember", type: "boolean", example: false),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Login successful"),
            new OA\Response(response: 422, description: "Invalid credentials")
        ]
    )]
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
                'user' => [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'plan' => $user->plan,
        'subscription_status' => $user->subscription_status,
        'subscription_expires_at' => $user->subscription_expires_at,
    ],
            'token' => $token,
        ]);
    }

    #[OA\Get(
        path: "/user",
        summary: "Get authenticated user",
        tags: ["User"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "User data retrieved successfully"),
            new OA\Response(response: 401, description: "Unauthenticated")
        ]
    )]
    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    #[OA\Post(
        path: "/logout",
        summary: "Logout user",
        tags: ["Authentication"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "Logged out successfully"),
            new OA\Response(response: 401, description: "Unauthenticated")
        ]
    )]
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    #[OA\Post(
        path: "/forgot-password",
        summary: "Send password reset link",
        tags: ["Authentication"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["email"],
                properties: [
                    new OA\Property(property: "email", type: "string", format: "email", example: "john@example.com"),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Reset link sent"),
            new OA\Response(response: 422, description: "Email not found")
        ]
    )]
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Password reset link sent to your email',
            ]);
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }

    #[OA\Post(
        path: "/reset-password",
        summary: "Reset password",
        tags: ["Authentication"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["token", "email", "password", "password_confirmation"],
                properties: [
                    new OA\Property(property: "token", type: "string", example: "abc123..."),
                    new OA\Property(property: "email", type: "string", format: "email", example: "john@example.com"),
                    new OA\Property(property: "password", type: "string", format: "password", example: "newpassword123"),
                    new OA\Property(property: "password_confirmation", type: "string", format: "password", example: "newpassword123"),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Password reset successful"),
            new OA\Response(response: 422, description: "Invalid token or email")
        ]
    )]
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Password has been reset successfully',
            ]);
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }

    #[OA\Post(
        path: "/social-login",
        summary: "Social login",
        tags: ["Authentication"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["provider", "provider_id", "name", "email", "avatar"],
                properties: [
                    new OA\Property(property: "provider", type: "string", example: "google"),
                    new OA\Property(property: "provider_id", type: "string", example: "1234567890"),
                    new OA\Property(property: "name", type: "string", example: "John Doe"),
                    new OA\Property(property: "email", type: "string", format: "email", example: "john@example.com"),
                    new OA\Property(property: "avatar", type: "string", example: "https://example.com/avatar.jpg"),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Login successful"),
            new OA\Response(response: 422, description: "Validation error")
        ]
    )]

    /**
     * Handle social login (Google, LinkedIn)
     */
    public function socialLogin(Request $request)
    {
        $validated = $request->validate([
            'provider' => ['required', 'string', 'in:google,linkedin'],
            'provider_id' => ['required', 'string'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'avatar' => ['nullable', 'string'],
        ]);

        // Find or create user
        $user = User::where('email', $validated['email'])->first();
        $isNewUser = false;

        if (!$user) {
            // Create new user
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make(Str::random(24)), // Random password
                'email_verified_at' => now(), // Social accounts are verified
                'avatar' => $validated['avatar'],
                'provider' => $validated['provider'],
                'provider_id' => $validated['provider_id'],
            ]);

            $isNewUser = true;

            // Send welcome email to new users
            try {
                Mail::to($user->email)->send(new WelcomeEmail($user));
            } catch (\Exception $e) {
                // Log error but don't fail the login
                \Log::error('Failed to send welcome email: ' . $e->getMessage());
            }
        } else {
            // Update existing user's social info
            $user->update([
                'provider' => $validated['provider'],
                'provider_id' => $validated['provider_id'],
                'avatar' => $validated['avatar'] ?? $user->avatar,
            ]);
        }

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => $isNewUser ? 'Registration successful!' : 'Login successful',
            'user' => $user,
            'token' => $token,
            'is_new_user' => $isNewUser,
        ]);
    }
}
