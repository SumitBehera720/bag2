import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function setupAdmin() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });

        const BACKEND_DIR = '/home/u892283443/domains/darkgoldenrod-mink-800117.hostingersite.com/backend';

        const res = await ssh.execCommand(`cd ${BACKEND_DIR} && php -r "
            require 'vendor/autoload.php';
            \\$app = require_once 'bootstrap/app.php';
            \\$app->make(Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap();
            
            \\$user = App\\Models\\User::firstOrNew(['email' => 'admin@askmebag.com']);
            \\$user->name = 'Admin';
            \\$user->password = bcrypt('Qubnix123@');
            \\$user->save();
            
            echo 'Admin user ready: ' . \\$user->email . PHP_EOL;
        "`);

        console.log(res.stdout, res.stderr);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

setupAdmin();
