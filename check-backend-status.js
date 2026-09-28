import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function checkStatus() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });

        const BACKEND = '~/domains/darkgoldenrod-mink-800117.hostingersite.com/backend';

        console.log("Checking DB tables count...");
        const countRes = await ssh.execCommand(`cd ${BACKEND} && php -r '
            require "vendor/autoload.php";
            $app = require_once "bootstrap/app.php";
            $kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
            $kernel->bootstrap();
            echo "Products: " . App\\Models\\Product::count() . "\n";
            echo "Users: " . App\\Models\\User::count() . "\n";
        '`);
        console.log(countRes.stdout);
        if (countRes.stderr) console.error(countRes.stderr);

        // If products are 0, seed them!
        if (countRes.stdout.includes("Products: 0")) {
            console.log("Seeding products...");
            const seedRes = await ssh.execCommand(`cd ${BACKEND} && php artisan db:seed --force`);
            console.log(seedRes.stdout, seedRes.stderr);
        }

        console.log("Testing frontend curl...");
        const front = await ssh.execCommand('curl -s -I https://darkgoldenrod-mink-800117.hostingersite.com/');
        console.log(front.stdout);

        console.log("Testing admin login page curl...");
        const admin = await ssh.execCommand('curl -s -I https://darkgoldenrod-mink-800117.hostingersite.com/api/admin/login');
        console.log(admin.stdout);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkStatus();
