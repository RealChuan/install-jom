const core = require('@actions/core');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

const nativePath = process.platform === "win32" ? path.win32 : path;

async function run() {
    try {
        const toolPath = argv.path;
        if (!toolPath) {
            throw new Error('The --path argument is missing');
        }
        core.addPath(nativePath.normalize(toolPath));
        console.log(`Added ${toolPath} to PATH`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
