const core = require('@actions/core');
const cache = require('@actions/cache');
const tc = require('@actions/tool-cache');
const io = require('@actions/io');
const exec = require('@actions/exec');
const path = require('path');
const fs = require('fs');

const JOM_URL = 'https://download.qt.io/official_releases/jom/jom.zip';

async function run() {
    try {
        // 验证平台
        if (process.platform !== 'win32') {
            core.warning('JOM is only supported on Windows platforms. Skipping JOM setup.');
            core.info('This is expected behavior - JOM is a Windows-specific build tool.');
            core.info('The workflow will continue without JOM installation.');

            // 设置空的输出值，避免后续步骤因缺少输出而失败
            core.setOutput('jom-path', '');
            core.setOutput('jom-version', '');
            core.setOutput('jom-skipped', 'true');

            core.info('✓ JOM setup skipped (non-Windows platform)');
            return;
        }

        // 获取输入参数
        const installPath = core.getInput('install-path') || 'C:\\jom';
        const cacheEnabled = core.getInput('cache-enabled') === 'true';

        core.info(`Setting up JOM on ${process.platform}...`);
        core.info(`Install path: ${installPath}`);
        core.info(`Cache enabled: ${cacheEnabled}`);

        // 确保安装目录存在
        await io.mkdirP(installPath);

        const jomExe = path.join(installPath, 'jom.exe');
        let cacheKey = '';
        let cacheHit = false;

        // 如果启用缓存，尝试恢复缓存
        if (cacheEnabled) {
            // 生成缓存键
            cacheKey = `jom-${process.platform}-${Buffer.from(installPath).toString('base64')}`;

            core.info(`Looking for cache with key: ${cacheKey}`);
            cacheHit = await cache.restoreCache([installPath], cacheKey);

            if (cacheHit) {
                core.info(`✓ Cache restored from key: ${cacheKey}`);

                // 验证缓存中的 JOM 是否可用
                if (fs.existsSync(jomExe)) {
                    try {
                        let versionOutput = '';
                        const options = {
                            listeners: {
                                stdout: (data) => {
                                    versionOutput += data.toString();
                                }
                            }
                        };

                        await exec.exec(jomExe, ['/version'], options);
                        const jomVersion = versionOutput.trim();

                        core.info(`✓ Using cached JOM version: ${jomVersion}`);

                        // 添加到 PATH
                        core.addPath(installPath);
                        core.setOutput('jom-path', installPath);
                        core.setOutput('jom-version', jomVersion);
                        core.setOutput('jom-skipped', 'false');

                        core.info('✓ JOM setup completed successfully (from cache)');
                        return;
                    } catch (error) {
                        core.warning('Cached JOM is corrupted, reinstalling...');
                        cacheHit = false;
                    }
                } else {
                    core.warning('Cached JOM not found, reinstalling...');
                    cacheHit = false;
                }
            } else {
                core.info('No cache found, proceeding with installation');
            }
        }

        // 下载 JOM
        core.info('Downloading JOM...');
        const downloadPath = await tc.downloadTool(JOM_URL);
        core.info(`Downloaded JOM to: ${downloadPath}`);

        // 清空安装目录
        core.info('Cleaning installation directory...');
        const items = await fs.promises.readdir(installPath);
        for (const item of items) {
            await io.rmRF(path.join(installPath, item));
        }

        // 解压
        core.info(`Extracting JOM to: ${installPath}`);
        await tc.extractZip(downloadPath, installPath);

        // 验证安装
        if (!fs.existsSync(jomExe)) {
            throw new Error(`jom.exe not found in ${installPath}`);
        }

        // 获取版本信息
        let versionOutput = '';
        const options = {
            listeners: {
                stdout: (data) => {
                    versionOutput += data.toString();
                }
            }
        };

        await exec.exec(jomExe, ['/version'], options);
        const jomVersion = versionOutput.trim();

        core.info(`JOM version: ${jomVersion}`);

        // 保存到缓存（如果启用）
        if (cacheEnabled && !cacheHit) {
            try {
                await cache.saveCache([installPath], cacheKey);
                core.info(`✓ Saved JOM to cache with key: ${cacheKey}`);
            } catch (error) {
                core.warning(`Failed to save cache: ${error.message}`);
            }
        }

        // 添加到 PATH
        core.addPath(installPath);
        core.info(`✓ Added JOM to PATH: ${installPath}`);

        // 设置输出
        core.setOutput('jom-path', installPath);
        core.setOutput('jom-version', jomVersion);
        core.setOutput('jom-skipped', 'false');

        core.info('✓ JOM setup completed successfully');

        // 清理下载的临时文件
        await io.rmRF(downloadPath);

    } catch (error) {
        core.setFailed(`JOM setup failed: ${error.message}`);
    }
}

// 仅当直接运行时执行
if (require.main === module) {
    run();
}

module.exports = { run };
