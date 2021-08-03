import {workspace, window} from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import {IFileConfig} from '.';
import {ERRORS, CONFIG_FILE_NAME, DEFAULT_CREATOR_CONFIG, DEFAULT_GIT_CONFIG} from './constatns';

/**
 * Returns config for extenstion
 */
export async function getConfig(): Promise<IFileConfig | never> {
    const ws = workspace;
    const vsConfig = workspace.getConfiguration();
    const config: IFileConfig = {
        creator: {
            separateResources: vsConfig.get('creator.separateResources') || DEFAULT_CREATOR_CONFIG.separateResources
        },
        git: {
            branchPrefix: vsConfig.get('git.branchPrefix') || DEFAULT_GIT_CONFIG.branchPrefix,
            branchNameSource: vsConfig.get('git.branchNameSource') || DEFAULT_GIT_CONFIG.branchNameSource,
            strictMode: vsConfig.get('git.strictMode') || DEFAULT_GIT_CONFIG.strictMode
        }
    }
    return new Promise((resolve) => {
        const folders = workspace.workspaceFolders;
        if (!folders) {
            throw new Error(ERRORS.workspaceFolder);
        }
        const configFilePath = path.join(folders[0].uri.fsPath, CONFIG_FILE_NAME);
        fs.readFile(configFilePath, 'utf-8', (error, data) => {
            if (error || !data) {
                resolve(config);
            } else {
                const config: IFileConfig = JSON.parse(data);
                resolve({
                    creator: {...config.creator, ...config.creator},
                    git: {...config.git, ...config.git}
                });
            }
        });
    });
}

/**
 * Shows errors with vscode native motification window
 * @param {Error | null} error Error object
 */
export function showError(error: Error | null): void {
    if (error) {
        window.showErrorMessage(error.message)
    }
}
