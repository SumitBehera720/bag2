import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function fixConfig() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });
        
        console.log("Removing api-platform.php...");
        await ssh.execCommand('rm -f ~/backend/config/api-platform.php');
        
        console.log("Clearing config cache...");
        const res = await ssh.execCommand('cd ~/backend && php artisan config:clear && php artisan cache:clear');
        console.log(res.stdout);
        if (res.stderr) console.error("STDERR:", res.stderr);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixConfig();
