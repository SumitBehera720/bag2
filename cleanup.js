import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function cleanupMainDomain() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });
        
        console.log("Cleaning up accidental deployment on main public_html...");
        
        // Remove the files I extracted from dist
        const toRemove = [
            '~/public_html/assets',
            '~/public_html/favicon.svg',
            '~/public_html/icons.svg',
            '~/public_html/media',
            '~/public_html/products',
            '~/public_html/api'
        ];
        
        for (let path of toRemove) {
            console.log("Removing:", path);
            await ssh.execCommand(`rm -rf ${path}`);
        }
        
        // Restore old index.html if possible
        console.log("Restoring old index.html...");
        await ssh.execCommand('cp ~/public_html/index.html.bak ~/public_html/index.html');
        
        console.log("Done cleaning up main domain!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

cleanupMainDomain();
