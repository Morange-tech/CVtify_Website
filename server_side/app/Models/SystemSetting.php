<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
    ];

    protected $casts = [
        'value' => 'array',
    ];

    public static function getValue(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();

        if (!$setting) {
            return $default;
        }

        return match ($setting->type) {
            'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
            'integer' => (int) $setting->value,
            'float' => (float) $setting->value,
            'json' => is_array($setting->value) ? $setting->value : json_decode($setting->value, true),
            default => $setting->value,
        };
    }

    public static function setValue(string $key, $value, string $type = 'string', string $group = 'general')
    {
        if ($type === 'json' && is_array($value)) {
            $storedValue = json_encode($value);
        } else {
            $storedValue = is_bool($value) ? ($value ? '1' : '0') : (string) $value;
        }

        return static::updateOrCreate(
            ['key' => $key],
            [
                'value' => $storedValue,
                'type' => $type,
                'group' => $group,
            ]
        );
    }
}
