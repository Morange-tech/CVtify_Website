<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;

class AdminSettingsController extends Controller
{
    protected array $defaults = [
        'platformName' => 'CVBuilder Pro',
        'tagline' => 'Build professional CVs in minutes',
        'contactEmail' => 'support@cvbuilder.pro',
        'contactPhone' => '+1 (555) 123-4567',
        'address' => '123 Innovation Street, Tech City, TC 10001',
        'website' => 'https://cvbuilder.pro',
        'language' => 'en',
        'timezone' => 'UTC',
        'dateFormat' => 'MM/DD/YYYY',

        'defaultFreeCVLimit' => 3,
        'maxFreeCVLimit' => 5,
        'defaultTemplate' => 'professional',
        'allowCustomColors' => true,
        'allowCustomFonts' => true,
        'availableFormats' => ['pdf'],
        'maxCVPages' => 3,
        'autoSaveInterval' => 30,

        'premiumMonthlyPrice' => 9.99,
        'premiumAnnualPrice' => 79.99,
        'currency' => 'USD',
        'trialDays' => 7,
        'enableFreeTrial' => true,
        'paymentMethods' => ['credit_card', 'paypal'],
        'autoRenew' => true,
        'refundPeriodDays' => 14,

        'enableAIAssistant' => true,
        'enableCVSharing' => true,
        'enableAnalytics' => true,
        'enablePublicProfile' => false,
        'enableMultiLanguageCV' => true,
        'enableCoverLetter' => true,
        'enableExportWord' => false,
        'enableExportPNG' => true,
        'enableWatermark' => false,
        'enableTemplateCustomization' => true,
        'maintenanceMode' => false,
        'enableRegistration' => true,

        'maxLoginAttempts' => 5,
        'sessionTimeout' => 60,
        'requireEmailVerification' => true,
        'require2FA' => false,
        'passwordMinLength' => 8,
        'allowSocialLogin' => true,
        'allowGoogleLogin' => true,
        'allowLinkedInLogin' => true,

        'maxFileUploadSize' => 5,
        'maxStoragePerUser' => 100,
        'enableCloudBackup' => true,
        'backupFrequency' => 'daily',
    ];

    protected array $types = [
        'platformName' => 'string',
        'tagline' => 'string',
        'contactEmail' => 'string',
        'contactPhone' => 'string',
        'address' => 'string',
        'website' => 'string',
        'language' => 'string',
        'timezone' => 'string',
        'dateFormat' => 'string',

        'defaultFreeCVLimit' => 'integer',
        'maxFreeCVLimit' => 'integer',
        'defaultTemplate' => 'string',
        'allowCustomColors' => 'boolean',
        'allowCustomFonts' => 'boolean',
        'availableFormats' => 'json',
        'maxCVPages' => 'integer',
        'autoSaveInterval' => 'integer',

        'premiumMonthlyPrice' => 'float',
        'premiumAnnualPrice' => 'float',
        'currency' => 'string',
        'trialDays' => 'integer',
        'enableFreeTrial' => 'boolean',
        'paymentMethods' => 'json',
        'autoRenew' => 'boolean',
        'refundPeriodDays' => 'integer',

        'enableAIAssistant' => 'boolean',
        'enableCVSharing' => 'boolean',
        'enableAnalytics' => 'boolean',
        'enablePublicProfile' => 'boolean',
        'enableMultiLanguageCV' => 'boolean',
        'enableCoverLetter' => 'boolean',
        'enableExportWord' => 'boolean',
        'enableExportPNG' => 'boolean',
        'enableWatermark' => 'boolean',
        'enableTemplateCustomization' => 'boolean',
        'maintenanceMode' => 'boolean',
        'enableRegistration' => 'boolean',

        'maxLoginAttempts' => 'integer',
        'sessionTimeout' => 'integer',
        'requireEmailVerification' => 'boolean',
        'require2FA' => 'boolean',
        'passwordMinLength' => 'integer',
        'allowSocialLogin' => 'boolean',
        'allowGoogleLogin' => 'boolean',
        'allowLinkedInLogin' => 'boolean',

        'maxFileUploadSize' => 'integer',
        'maxStoragePerUser' => 'integer',
        'enableCloudBackup' => 'boolean',
        'backupFrequency' => 'string',
    ];

    protected array $groups = [
        'platformName' => 'general',
        'tagline' => 'general',
        'contactEmail' => 'general',
        'contactPhone' => 'general',
        'address' => 'general',
        'website' => 'general',
        'language' => 'general',
        'timezone' => 'general',
        'dateFormat' => 'general',

        'defaultFreeCVLimit' => 'cv',
        'maxFreeCVLimit' => 'cv',
        'defaultTemplate' => 'cv',
        'allowCustomColors' => 'cv',
        'allowCustomFonts' => 'cv',
        'availableFormats' => 'cv',
        'maxCVPages' => 'cv',
        'autoSaveInterval' => 'cv',

        'premiumMonthlyPrice' => 'pricing',
        'premiumAnnualPrice' => 'pricing',
        'currency' => 'pricing',
        'trialDays' => 'pricing',
        'enableFreeTrial' => 'pricing',
        'paymentMethods' => 'pricing',
        'autoRenew' => 'pricing',
        'refundPeriodDays' => 'pricing',

        'enableAIAssistant' => 'features',
        'enableCVSharing' => 'features',
        'enableAnalytics' => 'features',
        'enablePublicProfile' => 'features',
        'enableMultiLanguageCV' => 'features',
        'enableCoverLetter' => 'features',
        'enableExportWord' => 'features',
        'enableExportPNG' => 'features',
        'enableWatermark' => 'features',
        'enableTemplateCustomization' => 'features',
        'maintenanceMode' => 'features',
        'enableRegistration' => 'features',

        'maxLoginAttempts' => 'security',
        'sessionTimeout' => 'security',
        'requireEmailVerification' => 'security',
        'require2FA' => 'security',
        'passwordMinLength' => 'security',
        'allowSocialLogin' => 'security',
        'allowGoogleLogin' => 'security',
        'allowLinkedInLogin' => 'security',

        'maxFileUploadSize' => 'storage',
        'maxStoragePerUser' => 'storage',
        'enableCloudBackup' => 'storage',
        'backupFrequency' => 'storage',
    ];

    public function index()
    {
        $settings = [];

        foreach ($this->defaults as $key => $default) {
            $settings[$key] = SystemSetting::getValue($key, $default);
        }

        return response()->json([
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'platformName' => ['required', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'contactEmail' => ['required', 'email'],
            'contactPhone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'website' => ['nullable', 'string'],
            'language' => ['required', 'string'],
            'timezone' => ['required', 'string'],
            'dateFormat' => ['required', 'string'],

            'defaultFreeCVLimit' => ['required', 'integer', 'min:1', 'max:10'],
            'maxFreeCVLimit' => ['required', 'integer', 'min:1', 'max:20'],
            'defaultTemplate' => ['required', 'string'],
            'allowCustomColors' => ['required', 'boolean'],
            'allowCustomFonts' => ['required', 'boolean'],
            'availableFormats' => ['required', 'array'],
            'maxCVPages' => ['required', 'integer', 'min:1', 'max:10'],
            'autoSaveInterval' => ['required', 'integer', 'min:10', 'max:120'],

            'premiumMonthlyPrice' => ['required', 'numeric', 'min:0'],
            'premiumAnnualPrice' => ['required', 'numeric', 'min:0'],
            'currency' => ['required', 'string'],
            'trialDays' => ['required', 'integer', 'min:0', 'max:30'],
            'enableFreeTrial' => ['required', 'boolean'],
            'paymentMethods' => ['required', 'array'],
            'autoRenew' => ['required', 'boolean'],
            'refundPeriodDays' => ['required', 'integer', 'min:0', 'max:30'],

            'enableAIAssistant' => ['required', 'boolean'],
            'enableCVSharing' => ['required', 'boolean'],
            'enableAnalytics' => ['required', 'boolean'],
            'enablePublicProfile' => ['required', 'boolean'],
            'enableMultiLanguageCV' => ['required', 'boolean'],
            'enableCoverLetter' => ['required', 'boolean'],
            'enableExportWord' => ['required', 'boolean'],
            'enableExportPNG' => ['required', 'boolean'],
            'enableWatermark' => ['required', 'boolean'],
            'enableTemplateCustomization' => ['required', 'boolean'],
            'maintenanceMode' => ['required', 'boolean'],
            'enableRegistration' => ['required', 'boolean'],

            'maxLoginAttempts' => ['required', 'integer', 'min:3', 'max:10'],
            'sessionTimeout' => ['required', 'integer', 'min:15', 'max:480'],
            'requireEmailVerification' => ['required', 'boolean'],
            'require2FA' => ['required', 'boolean'],
            'passwordMinLength' => ['required', 'integer', 'min:6', 'max:20'],
            'allowSocialLogin' => ['required', 'boolean'],
            'allowGoogleLogin' => ['required', 'boolean'],
            'allowLinkedInLogin' => ['required', 'boolean'],

            'maxFileUploadSize' => ['required', 'integer', 'min:1'],
            'maxStoragePerUser' => ['required', 'integer', 'min:1'],
            'enableCloudBackup' => ['required', 'boolean'],
            'backupFrequency' => ['required', 'string'],
        ]);

        foreach ($data as $key => $value) {
            SystemSetting::setValue(
                $key,
                $value,
                $this->types[$key] ?? 'string',
                $this->groups[$key] ?? 'general'
            );
        }

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => $data,
        ]);
    }

    public function reset()
    {
        foreach ($this->defaults as $key => $value) {
            SystemSetting::setValue(
                $key,
                $value,
                $this->types[$key] ?? 'string',
                $this->groups[$key] ?? 'general'
            );
        }

        return response()->json([
            'message' => 'Settings reset to defaults',
            'settings' => $this->defaults,
        ]);
    }
}
