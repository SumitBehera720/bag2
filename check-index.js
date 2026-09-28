import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function checkIndex() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });
        
        console.log("Checking index.html...");
        const res = await ssh.execCommand('cat ~/public_html/index.html');
        console.log(res.stdout);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkIndex();
