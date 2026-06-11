/**
 * @file deploy-twbs-icons.mjs
 * @description Automates the recursive deployment of TWBS Icons from the src source to the public distribution directory.
 */

import { cp } from 'node:fs/promises';
import { resolve } from 'node:path';

/**
 * Transfers static Bootstrap assets from the internal src directory to the public web root.
 * 
 * This function iterates through defined asset folders and performs a recursive copy 
 * operation. If the destination exists, it is overwritten.
 * 
 * @async
 * @function deployTwbsBootstrapAssets
 * @returns {Promise<void>} resolves when all copy operations complete successfully.
 * @throws {Error} specific filesystem error if the source is missing or destination is unwritable.
 */
async function deployTwbsBootstrapAssets() {
    const assetFolders = ['font'];
    const sourceRoot = 'src/vendor/twbs/icons/v1.13.1';
    const destinationRoot = 'public/vendor/twbs/icons/v1.13.1';

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

deployTwbsBootstrapAssets();