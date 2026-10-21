<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductImage;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $path = file_exists(base_path('products.json')) 
            ? base_path('products.json') 
            : base_path('../products.json');
        $json = file_exists($path) ? file_get_contents($path) : null;
        $products = $json ? json_decode($json, true) : null;

        if (!$products) {
            $this->command->warn('products.json not found or invalid. Skipping product seeding.');
            return;
        }

        foreach ($products as $p) {
            $product = Product::updateOrCreate(
                ['string_id' => $p['id']],
                [
                    'name' => $p['name'],
                    'slug' => \Illuminate\Support\Str::slug($p['name']),
                    'sku' => $p['sku'] ?? null,
                    'category' => $p['category'] ?? null,
                    'tagline' => $p['tagline'] ?? null,
                    'description' => $p['tagline'] ?? null,
                    'capacity' => $p['capacity'] ?? null,
                    'laptop_fit' => $p['laptopFit'] ?? null,
                    'primary_image' => $p['cutoutImage'] ?? $p['defaultImage'] ?? null,
                    'min_order' => $p['minOrder'] ?? 50,
                    'lead_time' => $p['leadTime'] ?? '7-10 Days',
                    'logo_position' => $p['logoPosition'] ?? null,
                    'is_customizable' => $p['isCustomizable'] ?? true,
                    'materials' => $p['materials'] ?? null,
                    'color_options' => $p['colorOptions'] ?? null,
                    'features' => $p['features'] ?? null,
                    'branding_options' => $p['brandingOptions'] ?? null,
                    'is_active' => true,
                    'sort_order' => $p['index'] ?? 0,
                ]
            );

            // Seed images if present
            if (!empty($p['images'])) {
                foreach ($p['images'] as $i => $img) {
                    ProductImage::updateOrCreate(
                        ['product_id' => $product->id, 'path' => $img['url']],
                        [
                            'label' => $img['label'] ?? 'Image',
                            'is_primary' => $i === 0,
                            'sort_order' => $i,
                        ]
                    );
                }
            }
        }

        $this->command->info('Seeded ' . count($products) . ' products from products.json');
    }
}
