import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function testLive() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });

        const urls = [
            'https://darkgoldenrod-mink-800117.hostingersite.com/',
            'https://darkgoldenrod-mink-800117.hostingersite.com/products',
            'https://darkgoldenrod-mink-800117.hostingersite.com/admin',
            'https://darkgoldenrod-mink-800117.hostingersite.com/api/admin',
            'https://darkgoldenrod-mink-800117.hostingersite.com/api/admin/login',
            'https://darkgoldenrod-mink-800117.hostingersite.com/api/products',
        ];

        for (const url of urls) {
            console.log(`\n=== Testing ${url} ===`);
            const res = await ssh.execCommand(`curl -s -L -I "${url}" | head -n 12`);
            console.log(res.stdout.trim());
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testLive();
