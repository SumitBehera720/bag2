import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function fixHtaccess() {
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

    # Don't touch the api symlink directory or any files inside it
    RewriteCond %{REQUEST_URI} ^/api [NC]
    RewriteRule ^ - [L]

    # If the requested resource is an existing file, serve it directly
    RewriteCond %{REQUEST_FILENAME} -f
    RewriteRule ^ - [L]

    # Everything else goes to index.html for React Router (handles /products, /contact, etc.)
    RewriteRule ^ index.html [L]
</IfModule>
`;

        await ssh.execCommand(`cat << 'EOF' > ~/domains/darkgoldenrod-mink-800117.hostingersite.com/public_html/.htaccess\n${htaccess}\nEOF`);
        console.log("Updated .htaccess!");

        console.log("Testing /products URL...");
        const res = await ssh.execCommand('curl -s -L -I https://darkgoldenrod-mink-800117.hostingersite.com/products');
        console.log(res.stdout);

        console.log("Testing an image file (e.g. /products/cutout/1.png)...");
        const resImg = await ssh.execCommand('curl -s -I https://darkgoldenrod-mink-800117.hostingersite.com/products/cutout/1.png');
        console.log(resImg.stdout);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixHtaccess();
