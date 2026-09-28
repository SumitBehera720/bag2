import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function cleanBackend() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });
        
        console.log("Removing merged backend and extracting clean...");
        // Rename the old backend just in case instead of deleting
        await ssh.execCommand('mv ~/backend ~/backend_old_backup_merged');
        
        console.log("Extracting fresh backend.zip...");
        await ssh.execCommand('unzip -o backend.zip -d ~/');
        
        console.log("Fixing .env APP_URL in the fresh backend...");
        await ssh.execCommand('sed -i "s|APP_URL=http://localhost:8000|APP_URL=https://darkgoldenrod-mink-800117.hostingersite.com/api|g" ~/backend/.env');
        await ssh.execCommand('echo "ASSET_URL=https://darkgoldenrod-mink-800117.hostingersite.com/api" >> ~/backend/.env');
        
        console.log("Optimizing...");
        await ssh.execCommand('cd ~/backend && php artisan config:clear && php artisan optimize:clear');
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

cleanBackend();
