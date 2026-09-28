import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function fixApiSymlink() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });
        
        console.log("Fixing symlink...");
        await ssh.execCommand('rm -rf ~/public_html/api');
        await ssh.execCommand('ln -s ~/backend/public ~/public_html/api');
        console.log("Done!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixApiSymlink();
