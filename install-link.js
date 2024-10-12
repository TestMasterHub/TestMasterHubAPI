const { exec } = require('child_process');

// Helper function to execute commands
function executeCommand(command, description) {
    return new Promise((resolve, reject) => {
        console.log(`Running ${description}...`);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error during ${description}: ${error.message}`);
                console.error(`stderr: ${stderr}`);
                reject(error);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`${description} completed.`);
            resolve();
        });
    });
}

// Main function to run npm install and npm link
(async () => {
    try {
        // Ensure npm dependencies are linked
        await executeCommand('npm link', 'npm link');
        
        // Start all services: Frontend, Proxy, and Internal API
        await executeCommand('npm start', 'TestMasterHub-tool with all services');
        
        console.log('Project is ready to use!');
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
})();
