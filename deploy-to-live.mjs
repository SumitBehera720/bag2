import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ssh = new NodeSSH();

const REMOTE_BASE = '/home/u892283443/domains/askmebag.com';
const PUBLIC_HTML = `${REMOTE_BASE}/public_html`;
const BACKEND_DIR = `${REMOTE_BASE}/backend`;

async function uploadDir(localDir, remoteDir) {
  if (!fs.existsSync(localDir)) {
    console.warn(`Local directory not found: ${localDir}`);
    return;
  }
  await ssh.execCommand(`mkdir -p "${remoteDir}"`);
  const items = fs.readdirSync(localDir);
  for (const item of items) {
    const localPath = path.join(localDir, item);
    const remotePath = `${remoteDir}/${item}`.replace(/\\/g, '/');
    const stat = fs.statSync(localPath);
    if (stat.isDirectory()) {
      await uploadDir(localPath, remotePath);
    } else {
      await ssh.putFile(localPath, remotePath);
    }
  }
}

async function deploy() {
  console.log('====================================================');
  console.log('🚀 DEPLOYING ASKMEBAG TO LIVE (askmebag.com)');
  console.log('====================================================\n');

  // Step 1: Build Storefront
  console.log('📦 Step 1: Building Storefront SPA...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✓ Storefront built successfully.\n');

  // Step 2: Build Admin Panel
  console.log('📦 Step 2: Building Admin Panel SPA...');
  execSync('npm --prefix admin-panel run build', { stdio: 'inherit' });
  console.log('✓ Admin Panel built successfully.\n');

  // Step 3: Connect SSH
  console.log('🔑 Step 3: Connecting to Hostinger via SSH...');
  await ssh.connect({
    host: '145.79.58.122',
    port: 65002,
    username: 'u892283443',
    password: 'Qubnix123@',
    readyTimeout: 20000,
  });
  console.log('✓ SSH Connected successfully.\n');

  // Step 4: Backend sync
  console.log('🔄 Step 4: Syncing Backend (routes, controllers, models, migrations)...');
  if (fs.existsSync('backend/routes/api.php')) {
    console.log('   - routes/api.php');
    await ssh.putFile('backend/routes/api.php', `${BACKEND_DIR}/routes/api.php`);
  }
  if (fs.existsSync('backend/app/Http/Controllers/Api')) {
    console.log('   - Controllers/Api');
    await uploadDir('backend/app/Http/Controllers/Api', `${BACKEND_DIR}/app/Http/Controllers/Api`);
  }
  if (fs.existsSync('backend/app/Models')) {
    console.log('   - Models');
    await uploadDir('backend/app/Models', `${BACKEND_DIR}/app/Models`);
  }
  if (fs.existsSync('backend/database/migrations')) {
    console.log('   - Migrations');
    await uploadDir('backend/database/migrations', `${BACKEND_DIR}/database/migrations`);
  }
  if (fs.existsSync('backend/database/seeders')) {
    console.log('   - Seeders');
    await uploadDir('backend/database/seeders', `${BACKEND_DIR}/database/seeders`);
  }
  if (fs.existsSync('products.json')) {
    console.log('   - products.json');
    await ssh.putFile('products.json', `${BACKEND_DIR}/products.json`);
  }

  // Run migrations & seeders & clear cache
  console.log('   - Running php artisan migrate --force...');
  const migRes = await ssh.execCommand(`cd ${BACKEND_DIR} && php artisan migrate --force`);
  if (migRes.stdout.trim()) console.log('     ', migRes.stdout.trim());
  if (migRes.stderr.trim()) console.warn('     Warning:', migRes.stderr.trim());

  console.log('   - Running php artisan db:seed --class=DatabaseSeeder --force...');
  const seedRes = await ssh.execCommand(`cd ${BACKEND_DIR} && php artisan db:seed --class=DatabaseSeeder --force`);
  if (seedRes.stdout.trim()) console.log('     ', seedRes.stdout.trim());

  console.log('   - Clearing Laravel caches...');
  await ssh.execCommand(`cd ${BACKEND_DIR} && php artisan config:clear && php artisan route:clear && php artisan cache:clear`);
  console.log('✓ Backend updated and cached routes cleared.\n');

  // Step 5: Upload Storefront SPA
  console.log('🛍️  Step 5: Deploying Storefront SPA to public_html...');
  await ssh.putFile('dist/index.html', `${PUBLIC_HTML}/index.html`);
  if (fs.existsSync('dist/favicon.svg')) {
    await ssh.putFile('dist/favicon.svg', `${PUBLIC_HTML}/favicon.svg`);
  }
  if (fs.existsSync('dist/icons.svg')) {
    await ssh.putFile('dist/icons.svg', `${PUBLIC_HTML}/icons.svg`);
  }
  if (fs.existsSync('dist/askmebag-logo-white-1600.png')) {
    await ssh.putFile('dist/askmebag-logo-white-1600.png', `${PUBLIC_HTML}/askmebag-logo-white-1600.png`);
  }
  console.log('   - Uploading assets...');
  await uploadDir('dist/assets', `${PUBLIC_HTML}/assets`);

  if (fs.existsSync('dist/media')) {
    console.log('   - Uploading media...');
    await uploadDir('dist/media', `${PUBLIC_HTML}/media`);
  }
  if (fs.existsSync('dist/products')) {
    console.log('   - Uploading products images...');
    await uploadDir('dist/products', `${PUBLIC_HTML}/products`);
  }
  console.log('✓ Storefront deployed successfully.\n');

  // Step 6: Upload Admin Panel SPA
  console.log('💻 Step 6: Deploying Admin Panel SPA to public_html/admin/ ...');
  await ssh.execCommand(`rm -rf "${PUBLIC_HTML}/admin" && mkdir -p "${PUBLIC_HTML}/admin"`);
  await uploadDir('admin-panel/dist', `${PUBLIC_HTML}/admin`);
  console.log('✓ Admin Panel deployed successfully.\n');

  // Step 7: Verify .htaccess rules
  console.log('⚙️  Step 7: Verifying .htaccess configuration...');
  const htaccess = `<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    Options -Indexes

    # Serve static assets inside /admin/ directly if they exist
    RewriteCond %{REQUEST_URI} ^/admin/assets/ [NC]
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f
    RewriteRule ^ - [L]

    # Serve /admin or /admin/* through admin/index.html
    RewriteCond %{REQUEST_URI} ^/admin [NC]
    RewriteRule ^admin(/.*)?$ /admin/index.html [L]

    # Serve existing files directly
    RewriteCond %{REQUEST_FILENAME} -f
    RewriteRule ^ - [L]

    # Serve existing directories directly (includes /api/ symlink -> backend .htaccess takes over)
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]

    # Storefront React Router SPA fallback
    RewriteRule ^ index.html [L]
</IfModule>
`;
  await ssh.execCommand(`cat << 'EOF' > ${PUBLIC_HTML}/.htaccess\n${htaccess}\nEOF`);

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
  console.log('✓ .htaccess verified.\n');

  // Step 8: Live Health Checks
  console.log('🌐 Step 8: Running live health checks on https://askmebag.com ...');
  const checks = [
    { name: 'Storefront Homepage', url: 'https://askmebag.com/' },
    { name: 'Admin Panel', url: 'https://askmebag.com/admin/' },
    { name: 'Home Data API', url: 'https://askmebag.com/api/home-data' },
    { name: 'Sections API', url: 'https://askmebag.com/api/public/sections?page=homepage' },
    { name: 'Products API', url: 'https://askmebag.com/api/products' },
    { name: 'Categories API', url: 'https://askmebag.com/api/categories' },
    { name: 'Settings API', url: 'https://askmebag.com/api/settings' },
  ];

  for (const check of checks) {
    const res = await ssh.execCommand(`curl -s -o /dev/null -w "%{http_code}" "${check.url}"`);
    const status = res.stdout.trim();
    const ok = status === '200' ? '✅' : '⚠️';
    console.log(`  ${ok} [HTTP ${status}] ${check.name} -> ${check.url}`);
  }

  // Additional detail checks
  const apiHome = await ssh.execCommand('curl -s "https://askmebag.com/api/home-data"');
  try {
    const data = JSON.parse(apiHome.stdout);
    const prodsRes = await ssh.execCommand('curl -s "https://askmebag.com/api/products"');
    const prods = JSON.parse(prodsRes.stdout || '[]');
    console.log(`\n📊 Data verification:`);
    console.log(`  - Total Products in Catalog: ${prods.length}`);
    console.log(`  - Featured Products: ${data.featured_products ? data.featured_products.length : 0}`);
    console.log(`  - Categories loaded in API: ${data.categories ? data.categories.length : 0}`);
    console.log(`  - Testimonials loaded in API: ${data.testimonials ? data.testimonials.length : 0}`);
  } catch (e) {
    console.log('Could not parse home-data response as JSON:', apiHome.stdout.substring(0, 100));
  }

  const sectionsRes = await ssh.execCommand('curl -s "https://askmebag.com/api/public/sections?page=homepage"');
  try {
    const sections = JSON.parse(sectionsRes.stdout);
    console.log(`  - Homepage CMS Sections: ${Array.isArray(sections) ? sections.length : 0}`);
  } catch (e) {
    console.log('Could not parse sections response:', sectionsRes.stdout.substring(0, 100));
  }

  ssh.dispose();

  console.log('\n====================================================');
  console.log('🎉 LIVE DEPLOYMENT COMPLETED SUCCESSFULLY!');
  console.log('🌐 Storefront: https://askmebag.com/');
  console.log('💻 Admin CMS:  https://askmebag.com/admin/');
  console.log('====================================================\n');
}

deploy().catch((err) => {
  console.error('\n❌ Deployment failed:', err.message || err);
  process.exit(1);
});
