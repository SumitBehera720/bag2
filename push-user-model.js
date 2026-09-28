import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const ssh = new NodeSSH();

async function pushUser() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });

        const remotePath = '/home/u892283443/domains/darkgoldenrod-mink-800117.hostingersite.com/backend/app/Models/User.php';
        const content = fs.readFileSync('backend/app/Models/User.php', 'utf8');

        console.log("Writing User.php to:", remotePath);
        await ssh.execCommand(`cat << 'EOF' > ${remotePath}\n${content}\nEOF`);

        console.log("Verifying content on remote server:");
        const res = await ssh.execCommand(`cat ${remotePath}`);
        console.log(res.stdout);

        console.log("Clearing Laravel optimization caches:");
        const opt = await ssh.execCommand(`cd /home/u892283443/domains/darkgoldenrod-mink-800117.hostingersite.com/backend && php artisan optimize:clear`);
        console.log(opt.stdout);

        console.log("Testing canAccessPanel now:");
        const testRes = await ssh.execCommand(`cd /home/u892283443/domains/darkgoldenrod-mink-800117.hostingersite.com/backend && php -r "
            require 'vendor/autoload.php';
            \\$app = require_once 'bootstrap/app.php';
            \\$app->make(Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap();
            
            \\$u = App\\Models\\User::where('email', 'admin@askmebag.com')->first();
            \\$panel = Filament\\Facades\\Filament::getPanel('admin');
            echo 'User: ' . \\$u->email . PHP_EOL;
            echo 'Implements FilamentUser: ' . (\\$u instanceof Filament\\Models\\Contracts\\FilamentUser ? 'YES' : 'NO') . PHP_EOL;
            echo 'canAccessPanel: ' . (\\$u->canAccessPanel(\\$panel) ? 'YES' : 'NO') . PHP_EOL;
        "`);
        console.log(testRes.stdout, testRes.stderr);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

pushUser();
