<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\File;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $json = File::get(base_path('../products.json'));
        $products = json_decode($json, true);

        foreach ($products as $product) {
            Product::create([
                'string_id' => $product['id'] ?? null,
                'index' => $product['index'] ?? null,
                'name' => $product['name'],
                'sku' => $product['sku'] ?? null,
                'category' => $product['category'] ?? null,
                'tagline' => $product['tagline'] ?? null,
                'capacity' => $product['capacity'] ?? null,
                'laptopFit' => $product['laptopFit'] ?? null,
                'cutoutImage' => $product['cutoutImage'] ?? null,
                'styledImage' => $product['styledImage'] ?? null,
                'defaultImage' => $product['defaultImage'] ?? null,
                'minOrder' => $product['minOrder'] ?? null,
                'leadTime' => $product['leadTime'] ?? null,
                'logoPosition' => $product['logoPosition'] ?? null,
                'isCustomizable' => $product['isCustomizable'] ?? true,
                'materials' => $product['materials'] ?? null,
                'colorOptions' => $product['colorOptions'] ?? null,
                'features' => $product['features'] ?? null,
                'brandingOptions' => $product['brandingOptions'] ?? null,
            ]);
        }
    }
}
