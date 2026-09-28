import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function checkDomains() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });
        
        console.log("Checking domains...");
        const res = await ssh.execCommand('ls -la ~/domains/');
        console.log(res.stdout);
        const res2 = await ssh.execCommand('ls -la ~/');
        console.log(res2.stdout);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDomains();
