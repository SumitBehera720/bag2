import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function fixEnv() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });
        
        console.log("Fixing APP_URL in .env...");
        await ssh.execCommand('sed -i "s|APP_URL=http://localhost:8000|APP_URL=https://darkgoldenrod-mink-800117.hostingersite.com/api|g" ~/backend/.env');
        await ssh.execCommand('echo "ASSET_URL=https://darkgoldenrod-mink-800117.hostingersite.com/api" >> ~/backend/.env');
        
        // Clear caches
        console.log("Clearing Laravel config cache...");
        await ssh.execCommand('cd ~/backend && php artisan config:clear && php artisan cache:clear && php artisan route:clear');
        
        console.log("Done fixing ENV!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixEnv();
