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
	incorrectPath = 'Incorrent absolute path',
	userInput = 'Component and Library names were not filled correctly',
	moduleName = 'Module name is incorrect',
	vscodeRootPath = 'Can not define vscode root path',
	initName = 'Error in module / component / library names. Check tensor.lib.json file and user input and try again'
}
