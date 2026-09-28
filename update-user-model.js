import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function updateUserModel() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });

        const BACKEND = '~/domains/darkgoldenrod-mink-800117.hostingersite.com/backend';

        console.log("Uploading updated User.php...");
        await ssh.putFile('backend/app/Models/User.php', `${BACKEND}/app/Models/User.php`);

        console.log("Clearing Laravel caches...");
        await ssh.execCommand(`cd ${BACKEND} && php artisan optimize:clear`);

        console.log("Done!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateUserModel();
