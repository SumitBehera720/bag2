import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function seedProducts() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });

        const BACKEND_DIR = '/home/u892283443/domains/darkgoldenrod-mink-800117.hostingersite.com/backend';

        console.log("1. Uploading products.json to server...");
        await ssh.putFile('products.json', `${BACKEND_DIR}/products.json`);

        console.log("2. Updating ProductSeeder.php on server...");
        const seederCode = `<?php

namespace Database\\Seeders;

use Illuminate\\Database\\Seeder;
use App\\Models\\Product;
use Illuminate\\Support\\Facades\\File;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $path = base_path('products.json');
        if (!File::exists($path)) {
            $this->command->error("products.json not found at $path");
            return;
        }

        $json = File::get($path);
        $products = json_decode($json, true);

        // Clear existing products to prevent duplicates
        Product::truncate();

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
        $this->command->info("Seeded " . count($products) . " products successfully!");
    }
}
`;
        await ssh.execCommand(`cat << 'EOF' > ${BACKEND_DIR}/database/seeders/ProductSeeder.php\n${seederCode}\nEOF`);

        console.log("3. Running ProductSeeder...");
        const seedRes = await ssh.execCommand(`cd ${BACKEND_DIR} && php artisan db:seed --class=ProductSeeder --force`);
        console.log(seedRes.stdout, seedRes.stderr);

        console.log("4. Testing Products API response...");
        const apiRes = await ssh.execCommand('curl -s https://darkgoldenrod-mink-800117.hostingersite.com/api/products');
        console.log("Response length in bytes:", apiRes.stdout.length);
        console.log("Sample product from API:", apiRes.stdout.substring(0, 300));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedProducts();
