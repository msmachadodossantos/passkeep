/**
 * @file deploy-asset.mjs
 * @description Automates the recursive deployment of static assets (CSS, JS, and Media) from the internal source to the public distribution directory.
 */

import { cp } from 'node:fs/promises';
import { resolve } from 'node:path';

/**
 * Copies static asset directories from the internal source path to the public distribution folder.
 * 
 * This function maps through predefined asset categories and performs a recursive, 
 * forced copy operation to ensure the public directory remains synchronized with the source.
 * 
 * @async
 * @function deployAssets
 * @returns {Promise<void>} A promise that resolves when all assets are successfully synchronized.
 * @throws {Error} Logs a "Deployment Failed" message and terminates the process with exit code 1 if a filesystem error occurs.
 */
async function deployAssets() {
    const assetFolders = ['css', 'js', 'media'];
    const sourceRoot = 'src/asset';
    const destinationRoot = 'public/asset';

    try {
        const deploymentTasks = assetFolders.map(async (folder) => {
            const sourcePath = resolve(sourceRoot, folder);
            const destinationPath = resolve(destinationRoot, folder);

            await cp(sourcePath, destinationPath, {
                recursive: true,
                force: true
            });
        });

        await Promise.all(deploymentTasks);
    } catch (error) {
        console.error('Deployment Failed:', error.message);
        process.exit(1);
    }
}

deployAssets();