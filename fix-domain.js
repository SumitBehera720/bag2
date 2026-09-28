import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function fixDomain() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });
        
        console.log("Fixing deployment path...");
        
        // Ensure default.php is gone from the target domain if it exists
        await ssh.execCommand('rm -f ~/domains/darkgoldenrod-mink-800117.hostingersite.com/public_html/default.php');
        
        // We already have ~/dist because we unzipped frontend.zip to ~/ earlier
        // Let's copy it to the correct domain's public_html
        const res1 = await ssh.execCommand('cp -R ~/dist/* ~/domains/darkgoldenrod-mink-800117.hostingersite.com/public_html/');
        console.log("Copy React Output:", res1.stdout, res1.stderr);
        
        // Remove old symlink if it was a directory (just in case)
        await ssh.execCommand('rm -rf ~/domains/darkgoldenrod-mink-800117.hostingersite.com/public_html/api');
        
        // Link the backend to the correct domain's public_html
        const res2 = await ssh.execCommand('ln -s ~/backend/public ~/domains/darkgoldenrod-mink-800117.hostingersite.com/public_html/api');
        console.log("Symlink Output:", res2.stdout, res2.stderr);
        
        console.log("Done fixing domain!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixDomain();
