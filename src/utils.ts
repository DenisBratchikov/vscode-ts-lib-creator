import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import {IFileConfig} from '.';
import {ERRORS, CONFIG_FILE_NAME, DEFAULT_CONFIG} from './constatns';

/**
 * Returns config for extenstion
 */
export async function getConfig(): Promise<IFileConfig | never> {
    return new Promise((resolve) => {
        const folders = vscode.workspace.workspaceFolders;
        if (!folders) {
            throw new Error(ERRORS.workspaceFolder);
        }
        const configFilePath = path.join(folders[0].uri.fsPath, CONFIG_FILE_NAME);
        fs.readFile(configFilePath, 'utf-8', (error, data) => {
            if (error || !data) {
                resolve(DEFAULT_CONFIG);
            } else {
                const config: IFileConfig = JSON.parse(data);
                resolve({
                    creator: {...DEFAULT_CONFIG.creator, ...config.creator},
                    git: {...DEFAULT_CONFIG.git, ...config.git}
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
        vscode.window.showErrorMessage(error.message)
    }
}
