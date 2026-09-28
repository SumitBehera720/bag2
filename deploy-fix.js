import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const ssh = new NodeSSH();

async function deployFix() {
    try {
        console.log("1. Connecting to Hostinger SSH...");
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });
        console.log("Connected successfully!");

        const DOMAIN_DIR = '/home/u892283443/domains/darkgoldenrod-mink-800117.hostingersite.com';
        const BACKEND_DIR = `${DOMAIN_DIR}/backend`;
        const PUBLIC_HTML = `${DOMAIN_DIR}/public_html`;

        console.log("2. Restoring any old ~/backend backup to keep user's other sites safe...");
        await ssh.execCommand('if [ -d ~/backend_old_backup_merged ] && [ ! -d ~/backend ]; then mv ~/backend_old_backup_merged ~/backend; fi');

        console.log("3. Uploading backend.zip to the domain directory...");
        await ssh.putFile('backend.zip', `${DOMAIN_DIR}/backend.zip`);
        console.log("Uploaded backend.zip successfully!");

        console.log("4. Extracting backend in domain folder...");
        await ssh.execCommand(`rm -rf ${BACKEND_DIR}`);
        await ssh.execCommand(`unzip -o ${DOMAIN_DIR}/backend.zip -d ${DOMAIN_DIR}/`);
        await ssh.execCommand(`rm -f ${DOMAIN_DIR}/backend.zip`);

        console.log("5. Uploading updated cors.php and web.php...");
        await ssh.putFile('backend/config/cors.php', `${BACKEND_DIR}/config/cors.php`);
        await ssh.putFile('backend/routes/web.php', `${BACKEND_DIR}/routes/web.php`);

        console.log("6. Configuring .env for Laravel backend...");
        const envContent = `APP_NAME=AskMeBag
APP_ENV=production
APP_KEY=base64:7xbVtJwN2rHncRnfb/v0j2SGL8t0iZgHJFSZ5ZMur/M=
APP_DEBUG=true
APP_URL=https://darkgoldenrod-mink-800117.hostingersite.com/api
ASSET_URL=https://darkgoldenrod-mink-800117.hostingersite.com/api

APP_LOCALE=en
APP_FALLBACK_LOCALE=en

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=u892283443_askmebag01
DB_USERNAME=u892283443_askmebag01
DB_PASSWORD=Qubnix123@

SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=public
QUEUE_CONNECTION=sync
CACHE_STORE=file
`;
        await ssh.execCommand(`cat << 'EOF' > ${BACKEND_DIR}/.env\n${envContent}\nEOF`);

        console.log("7. Creating symlink for /api...");
        await ssh.execCommand(`rm -rf ${PUBLIC_HTML}/api`);
        await ssh.execCommand(`ln -sfn ${BACKEND_DIR}/public ${PUBLIC_HTML}/api`);

        console.log("8. Writing .htaccess in public_html for SPA routing & /admin redirect...");
        const htaccessContent = `<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Redirect /admin and /admin/* to /api/admin
    RewriteRule ^admin/?(.*)$ /api/admin/$1 [R=301,L]

    # Don't touch the api symlink directory or any files inside it
    RewriteCond %{REQUEST_URI} ^/api [NC]
    RewriteRule ^ - [L]

    # Serve existing files and directories directly
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [L]
</IfModule>
`;
        await ssh.execCommand(`cat << 'EOF' > ${PUBLIC_HTML}/.htaccess\n${htaccessContent}\nEOF`);

        console.log("9. Writing .htaccess in backend/public for API routing...");
        const backendHtaccess = `<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On
    RewriteBase /api/

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Handle X-XSRF-Token Header
    RewriteCond %{HTTP:x-xsrf-token} .
    RewriteRule .* - [E=HTTP_X_XSRF_TOKEN:%{HTTP:X-XSRF-Token}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
`;
        await ssh.execCommand(`cat << 'EOF' > ${BACKEND_DIR}/public/.htaccess\n${backendHtaccess}\nEOF`);

        console.log("10. Setting permissions & clearing Laravel cache...");
        await ssh.execCommand(`chmod -R 775 ${BACKEND_DIR}/storage ${BACKEND_DIR}/bootstrap/cache`);
        await ssh.execCommand(`cd ${BACKEND_DIR} && php artisan config:clear && php artisan cache:clear && php artisan route:clear && php artisan view:clear`);
        await ssh.execCommand(`cd ${BACKEND_DIR} && php artisan storage:link`);

        console.log("11. Testing endpoints...");
        const resProd = await ssh.execCommand('curl -s https://darkgoldenrod-mink-800117.hostingersite.com/api/products');
        console.log("Products API sample:", resProd.stdout.substring(0, 150));

        const resAdmin = await ssh.execCommand('curl -s -I https://darkgoldenrod-mink-800117.hostingersite.com/api/admin');
        console.log("Admin Status:\n", resAdmin.stdout);

        const resAdminRedirect = await ssh.execCommand('curl -s -I https://darkgoldenrod-mink-800117.hostingersite.com/admin');
        console.log("/admin Redirect Status:\n", resAdminRedirect.stdout);

        console.log("DEPLOYMENT COMPLETE!");
        process.exit(0);
    } catch (err) {
        console.error("Deploy failed:", err);
        process.exit(1);
    }
}

deployFix();
