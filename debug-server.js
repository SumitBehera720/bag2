import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function debugServer() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });
        
        console.log("=== 1. Checking ~/domains/darkgoldenrod-mink-800117.hostingersite.com/ ===");
        const r1 = await ssh.execCommand('ls -la ~/domains/darkgoldenrod-mink-800117.hostingersite.com/');
        console.log(r1.stdout);

        console.log("=== 2. Checking public_html inside that domain ===");
        const r2 = await ssh.execCommand('ls -la ~/domains/darkgoldenrod-mink-800117.hostingersite.com/public_html');
        console.log(r2.stdout);

        console.log("=== 3. Checking ~/backend ===");
        const r3 = await ssh.execCommand('ls -d ~/backend');
        console.log(r3.stdout, r3.stderr);

        console.log("=== 4. Checking .htaccess in public_html ===");
        const r4 = await ssh.execCommand('cat ~/domains/darkgoldenrod-mink-800117.hostingersite.com/public_html/.htaccess');
        console.log(r4.stdout);

        console.log("=== 5. Checking curl localhost / domain ===");
        const r5 = await ssh.execCommand('curl -I http://127.0.0.1/ || curl -I https://darkgoldenrod-mink-800117.hostingersite.com/');
        console.log(r5.stdout, r5.stderr);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debugServer();
