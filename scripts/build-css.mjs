/**
 * @file build-css.mjs
 * @description Automated build script to bundle, minify, and generate source maps for CSS assets using Lightning CSS.
 */

import { bundle, browserslistToTargets } from 'lightningcss';
import { mkdir, writeFile, readdir } from 'node:fs/promises';
import { join, dirname, extname, basename, relative } from 'node:path';
import browserslist from 'browserslist';

/** @constant {string} SOURCE_DIRECTORY - The root path for raw CSS assets. */
const SOURCE_DIRECTORY = 'src/asset/css';

/** @constant {string} DISTRIBUTION_DIRECTORY - The output path for processed CSS files. */
const DISTRIBUTION_DIRECTORY = 'src/asset/css';

/** @type {Object} compilationTargets - Browser compatibility targets derived from browserslist configuration. */
const compilationTargets = browserslistToTargets(browserslist());

/**
 * Orchestrates the CSS build process by scanning the source directory,
 * bundling files, and writing minified outputs with source maps.
 * 
 * @async
 * @function executeCssBuild
 * @returns {Promise<void>}
 * @throws {Error} Throws and logs an error message if directory reading or file writing fails.
 */
async function executeCssBuild() {
    try {
        const directoryEntries = await readdir(SOURCE_DIRECTORY, {
            recursive: true,
            withFileTypes: true
        });

        const targetFiles = directoryEntries
            .filter(entry => {
                const isCssFile = entry.isFile() && extname(entry.name) === '.css';
                const isAlreadyMinified = entry.name.endsWith('.min.css');
                return isCssFile && !isAlreadyMinified;
            })
            .map(entry => join(entry.parentPath || entry.path, entry.name));

        for (const inputPath of targetFiles) {
            const relativeFilePath = relative(SOURCE_DIRECTORY, inputPath);
            const fileNameBase = basename(relativeFilePath, '.css');

            const minifiedFileName = `${fileNameBase}.min.css`;
            const sourceMapName = `${fileNameBase}.css.map`;

            const outputDirectoryPath = join(DISTRIBUTION_DIRECTORY, dirname(relativeFilePath));
            const outputFilePath = join(outputDirectoryPath, minifiedFileName);
            const sourceMapPath = join(outputDirectoryPath, sourceMapName);

            await mkdir(outputDirectoryPath, { recursive: true });

            const { code, map } = bundle({
                filename: inputPath,
                minify: true,
                sourceMap: true,
                targets: compilationTargets,
                drafts: {
                    nesting: true
                }
            });

            const codeWithMapReference = Buffer.concat([
                code,
                Buffer.from(`\n/*# sourceMappingURL=${sourceMapName} */`)
            ]);

            await writeFile(outputFilePath, codeWithMapReference);

            if (map) {
                await writeFile(sourceMapPath, map);
            }
        }
    } catch (error) {
        console.error(`Build execution failed: ${error.message}`);
        process.exit(1);
    }
}

executeCssBuild();