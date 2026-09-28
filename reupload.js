import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function reupload() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });
        
        console.log("Uploading frontend.zip...");
        await ssh.putFile('frontend.zip', 'frontend.zip');
        
        console.log("Extracting to domain folder...");
        await ssh.execCommand('unzip -o frontend.zip -d ~/');
        await ssh.execCommand('cp -R ~/dist/* ~/domains/darkgoldenrod-mink-800117.hostingersite.com/public_html/');
        await ssh.execCommand('rm -rf ~/dist frontend.zip');
        await ssh.execCommand('rm -f ~/domains/darkgoldenrod-mink-800117.hostingersite.com/public_html/default.php');
        
        console.log("Done!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

reupload();
