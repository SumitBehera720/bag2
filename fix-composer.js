import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function fixComposer() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });
        
        console.log("Running composer install...");
        const res = await ssh.execCommand('cd ~/backend && composer install --optimize-autoloader --no-dev');
        console.log(res.stdout);
        if (res.stderr) console.error("STDERR:", res.stderr);
        
        console.log("Clearing config cache again...");
        await ssh.execCommand('cd ~/backend && php artisan config:clear && php artisan cache:clear');
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixComposer();
