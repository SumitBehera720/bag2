import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

async function testDb() {
    try {
        await ssh.connect({
            host: '145.79.58.122',
            port: 65002,
            username: 'u892283443',
            password: 'Qubnix123@',
        });
        
        console.log("Testing PHP MySQL connection...");
        const res = await ssh.execCommand(`php -r '
            $conn = @new mysqli("localhost", "u892283443_askmebag01", "Qubnix123@", "u892283443_askmebag01");
            if ($conn->connect_error) {
                echo "FAIL: " . $conn->connect_error . "\n";
            } else {
                echo "SUCCESS! Connected to MySQL database u892283443_askmebag01\n";
                $result = $conn->query("SHOW TABLES");
                while ($row = $result->fetch_array()) {
                    echo "Table: " . $row[0] . "\n";
                }
            }
        '`);
        console.log(res.stdout);
        if (res.stderr) console.error(res.stderr);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testDb();
