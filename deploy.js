import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function deploy() {
    try {
        console.log("Connecting to Hostinger SSH...");
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });
        
        console.log("Connected successfully!");

        // Uploading zip files
        console.log("Uploading frontend.zip...");
        await ssh.putFile('frontend.zip', 'frontend.zip');
        
        console.log("Uploading backend.zip...");
        await ssh.putFile('backend.zip', 'backend.zip');

        console.log("Extracting and organizing files...");
        // Command to extract the files
        // We will put the frontend inside public_html
        // And backend in a private folder, linking its public directory.
        const commands = [
            'unzip -o frontend.zip -d ~/',
            'unzip -o backend.zip -d ~/',
            'cp -R ~/dist/* ~/public_html/',
            'rm -rf ~/dist',
            'rm -f ~/public_html/api', // remove if existing file/link
            'ln -sfn ~/backend/public ~/public_html/api',
            'rm frontend.zip backend.zip'
        ];

        for (const cmd of commands) {
            console.log("Running:", cmd);
            const res = await ssh.execCommand(cmd);
            if (res.stdout) console.log("Output:", res.stdout);
            if (res.stderr) console.error("Error:", res.stderr);
        }

        console.log("Deployment completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Deployment failed:", err);
        process.exit(1);
    }
}

deploy();
