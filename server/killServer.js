const { exec } = require('child_process');
console.log(exec)

function killNodeServer() {
    exec('lsof -ti:4000', (findError, pid) => {
        if (findError) {
            console.error('Error finding server process:', findError);
            return;
        }

        if (!pid) {
            console.log('No server process found running on port 4000');
            return;
        }

        exec(`kill -9 ${pid.trim()}`, (killError) => {
            if (killError) {
                console.error('Error killing server process:', killError);
                return;
            }
            console.log(`Server process ${pid.trim()} has been killed`);
        });
    });
}

killNodeServer();