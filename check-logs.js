import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function getLogs() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });
        
        console.log("Checking Laravel logs...");
        const res = await ssh.execCommand('tail -n 30 ~/backend/storage/logs/laravel.log');
        console.log(res.stdout);
        if (res.stderr) console.error(res.stderr);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

getLogs();
