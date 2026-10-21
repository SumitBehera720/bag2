<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Product;
use App\Models\Inquiry;
use App\Models\Testimonial;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Products', Product::count())
                ->description('Active products in catalog')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->chart([7, 2, 10, 3, 15, 4, 17])
                ->color('success'),
            Stat::make('New Inquiries', Inquiry::where('status', 'new')->count())
                ->description('Unread messages from customers')
                ->descriptionIcon('heroicon-m-envelope')
                ->color('warning'),
            Stat::make('Total Testimonials', Testimonial::count())
                ->description('Reviews shown on website')
                ->descriptionIcon('heroicon-m-chat-bubble-left-right')
                ->color('info'),
        ];
    }
}
