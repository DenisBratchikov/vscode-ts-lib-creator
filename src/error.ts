import * as vscode from 'vscode';

/**
 * Shows errors with vscode native motification window
 * @param {Error | null} error Error object
 */
export function showError(error: Error | null): void {
    if (error) {
        vscode.window.showErrorMessage(error.message)
    }
}

// Error messages for user
export enum ERRORS {
	path = 'Incorrent path',
	userInput = 'Component and Library names were not filled correctly',
	vscodeRootPath = 'Can not define vscode root path',
	nonexistentPath = 'Collected module path does not exists'
}
