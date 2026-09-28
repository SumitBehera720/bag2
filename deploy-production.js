import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';

const ssh = new NodeSSH();

async function deploy() {
  const DOMAIN_DIR = '/home/u892283443/domains/darkgoldenrod-mink-800117.hostingersite.com';
  const PUBLIC_HTML = `${DOMAIN_DIR}/public_html`;

  try {
    console.log("1. Connecting to Hostinger SSH server...");
    await ssh.connect({
      host: '145.79.58.122',
      port: 65002,
      username: 'u892283443',
      password: 'Qubnix123@',
    });
    console.log("✓ Connected successfully!");

    // 2. Upload index.html
    console.log("2. Uploading fresh index.html...");
    await ssh.putFile('dist/index.html', `${PUBLIC_HTML}/index.html`);
    console.log("✓ Uploaded index.html");

    // 3. Upload assets
    console.log("3. Uploading compiled JS and CSS assets...");
    const assets = fs.readdirSync('dist/assets');
    for (const asset of assets) {
      const localPath = path.join('dist/assets', asset);
      const remotePath = `${PUBLIC_HTML}/assets/${asset}`;
      console.log(`   Uploading assets/${asset}...`);
      await ssh.putFile(localPath, remotePath);
    }
    console.log("✓ Uploaded all assets");

    // 4. Upload new media: comfort_style_backpack.jpg
    if (fs.existsSync('dist/media/comfort_style_backpack.jpg')) {
      console.log("4. Uploading new media/comfort_style_backpack.jpg...");
      await ssh.putFile(
        'dist/media/comfort_style_backpack.jpg',
        `${PUBLIC_HTML}/media/comfort_style_backpack.jpg`
      );
      console.log("✓ Uploaded comfort_style_backpack.jpg");
    }

    // 5. Ensure permissions and check files
    console.log("5. Verifying remote deployment...");
    const checkRes = await ssh.execCommand(`ls -lh ${PUBLIC_HTML}/assets && ls -lh ${PUBLIC_HTML}/media/comfort_style_backpack.jpg`);
    console.log(checkRes.stdout);

    // 6. Test Live URLs
    console.log("6. Testing live endpoints...");
    const testCmd = `curl -s -I "https://darkgoldenrod-mink-800117.hostingersite.com/" | head -n 5`;
    const liveRes = await ssh.execCommand(testCmd);
    console.log("Live Home Status:\n", liveRes.stdout);

    const testImgCmd = `curl -s -I "https://darkgoldenrod-mink-800117.hostingersite.com/media/comfort_style_backpack.jpg" | head -n 5`;
    const liveImgRes = await ssh.execCommand(testImgCmd);
    console.log("Live Image Status:\n", liveImgRes.stdout);

    console.log("\n==========================================");
    console.log("🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!");
    console.log("Live Site: https://darkgoldenrod-mink-800117.hostingersite.com/");
    console.log("==========================================\n");
    process.exit(0);
  } catch (err) {
    console.error("❌ Deployment failed:", err);
    process.exit(1);
  }
}

deploy();
