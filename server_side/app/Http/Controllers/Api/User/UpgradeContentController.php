<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\PricingPlan;
use Illuminate\Http\Request;

class UpgradeContentController extends Controller
{
    public function index()
    {
        $plans = PricingPlan::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->keyBy('slug')
            ->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'slug' => $plan->slug,
                    'currency' => $plan->currency,
                    'monthlyPrice' => (float) $plan->monthly_price,
                    'yearlyPrice' => (float) $plan->yearly_price,
                    'shortDescription' => $plan->short_description,
                    'isRecommended' => $plan->is_recommended,
                    'meta' => $plan->meta ?? [],
                ];
            });

        $faqs = Faq::query()
            ->where('page', 'upgrade')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($faq) {
                return [
                    'id' => $faq->id,
                    'question' => $faq->question,
                    'answer' => $faq->answer,
                ];
            });

        return response()->json([
            'data' => [
                'plans' => $plans,
                'faqs' => $faqs,
            ],
        ]);
    }
}
