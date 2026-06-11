/**
 * @file setup-plantuml.mjs
 * @description Automates the installation of Java, PlantUML, and Graphviz across multiple platforms.
 * Detects the host Operating System and utilizes the appropriate package manager (APT, Homebrew, or Chocolatey).
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';

/** @type {Function} Promisified version of the child_process exec function for async/await usage. */
const executeAsync = promisify(exec);

/**
 * Executes a shell command and logs standard output or errors to the console.
 *
 * @async
 * @function runShellCommand
 * @param {string} command - The shell command to be executed.
 * @returns {Promise<void>} Resolves when the command finishes successfully.
 * @throws {Error} Terminates the process if the command execution fails to ensure environment integrity.
 */
async function runShellCommand(command) {
    try {
        console.log(`> Executing: ${command}`);
        const { stdout, stderr } = await executeAsync(command);
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
    } catch (error) {
        console.error(`Error executing command: ${command}\n`, error.message);
        process.exit(1);
    }
}

/**
 * Orchestrates the installation of the PlantUML environment and its dependencies.
 * 
 * Identifies the platform and runs specific installation logic for Linux, macOS, and Windows.
 *
 * @async
 * @function initializePlantUmlEnvironment
 * @returns {Promise<void>} Resolves when all dependencies are installed and verified.
 */
async function initializePlantUmlEnvironment() {
    /** @type {string} Host platform identifier. */
    const currentPlatform = os.platform();

    console.log(`Starting environment setup [Platform: ${currentPlatform}]\n`);

    if (currentPlatform === 'linux') {
        console.log('--- Installing Java, PlantUML, and Graphviz via APT ---');
        await runShellCommand('sudo apt update');
        await runShellCommand('sudo apt install -y default-jdk plantuml graphviz');
    } else if (currentPlatform === 'darwin') {
        console.log('--- Installing Java, PlantUML, and Graphviz via Homebrew ---');
        await runShellCommand('brew install openjdk plantuml graphviz');
    } else if (currentPlatform === 'win32') {
        console.log('--- Installing Java, PlantUML, and Graphviz via Chocolatey ---');
        console.log('Reminder: Ensure your terminal is running as Administrator.');
        await runShellCommand('choco install openjdk plantuml graphviz -y');
    } else {
        console.log('Operating System not automatically supported for scripted setup.');
        return;
    }

    console.log('\n--- Verifying Installations ---');
    await runShellCommand('java -version');
    await runShellCommand('dot -V');

    console.log('\nSetup complete! PlantUML is now ready with the Graphviz engine.');
}

initializePlantUmlEnvironment();