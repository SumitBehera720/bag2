import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function inspectLivewire() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });

        const BACKEND = '~/domains/darkgoldenrod-mink-800117.hostingersite.com/backend';

        const res = await ssh.execCommand(`cd ${BACKEND} && grep -rn "function getUpdateUri" vendor/livewire/livewire/src`);
        console.log(res.stdout);

        const res2 = await ssh.execCommand(`cd ${BACKEND} && grep -rn "function setUpdateUri" vendor/livewire/livewire/src`);
        console.log(res2.stdout);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

inspectLivewire();
