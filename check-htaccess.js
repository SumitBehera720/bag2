import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function checkServer() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });
        
        console.log("Checking .htaccess...");
        const res = await ssh.execCommand('cat ~/public_html/.htaccess');
        console.log(res.stdout);
        
        console.log("Checking default.php...");
        const res2 = await ssh.execCommand('cat ~/public_html/default.php');
        console.log(res2.stdout);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkServer();
