import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function checkLog() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });

        const BACKEND = '~/domains/darkgoldenrod-mink-800117.hostingersite.com/backend';

        console.log("=== Checking last 50 lines of laravel.log ===");
        const logRes = await ssh.execCommand(`tail -n 50 ${BACKEND}/storage/logs/laravel.log`);
        console.log(logRes.stdout);

        console.log("=== Testing User canAccessPanel in PHP ===");
        const userTest = await ssh.execCommand(`cd ${BACKEND} && php -r "
            require 'vendor/autoload.php';
            \\$app = require_once 'bootstrap/app.php';
            \\$app->make(Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap();
            
            \\$u = App\\Models\\User::where('email', 'admin@askmebag.com')->first();
            \\$panel = Filament\\Facades\\Filament::getPanel('admin');
            echo 'User: ' . \\$u->email . PHP_EOL;
            echo 'Implements FilamentUser: ' . (\\$u instanceof Filament\\Models\\Contracts\\FilamentUser ? 'YES' : 'NO') . PHP_EOL;
            echo 'canAccessPanel: ' . (\\$u->canAccessPanel(\\$panel) ? 'YES' : 'NO') . PHP_EOL;
        "`);
        console.log(userTest.stdout, userTest.stderr);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkLog();
