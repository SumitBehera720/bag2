import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function fixLivewire() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });

        const htaccess = `<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Disable directory listing
    Options -Indexes

    # Redirect /admin and /admin/* to /api/admin
    RewriteRule ^admin/?(.*)$ /api/admin/$1 [R=301,L]

    # Route Livewire requests directly to backend api/index.php
    RewriteRule ^livewire/(.*)$ api/index.php [L,QSA]

    # Don't touch the api symlink directory or any files inside it
    RewriteCond %{REQUEST_URI} ^/api [NC]
    RewriteRule ^ - [L]

    # If the requested resource is an existing file, serve it directly
    RewriteCond %{REQUEST_FILENAME} -f
    RewriteRule ^ - [L]

    # Everything else goes to index.html for React Router
    RewriteRule ^ index.html [L]
</IfModule>
`;

        await ssh.execCommand(`cat << 'EOF' > ~/domains/darkgoldenrod-mink-800117.hostingersite.com/public_html/.htaccess\n${htaccess}\nEOF`);
        console.log("Updated .htaccess with Livewire rule!");

        console.log("Testing livewire.js header...");
        const res = await ssh.execCommand('curl -s -I https://darkgoldenrod-mink-800117.hostingersite.com/livewire/livewire.js');
        console.log(res.stdout);

        console.log("Testing livewire/update endpoint...");
        const resUp = await ssh.execCommand('curl -s -I -X POST https://darkgoldenrod-mink-800117.hostingersite.com/livewire/update');
        console.log(resUp.stdout);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixLivewire();
