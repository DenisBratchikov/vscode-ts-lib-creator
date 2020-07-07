// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {Creator} from './creator';
import {getPath, getComponentInitData, getLibraryInitData} from './init';
import {USER_INPUT_PLACEHOLDER} from './constants';
import {showError} from './error';

/**
 * Returns initializating data for creating library
 * @param {string} path Path to the folder, where the context menu was opened
 */
function getLibraryData(path: string): Promise<libraryCreator.initData> {
	return getPath(path, USER_INPUT_PLACEHOLDER.libraryPath).then((modulePath: string) => {
		return getLibraryInitData(modulePath).then((initData: libraryCreator.initData | void) => {
			if (initData) {
				return initData;
			}
			throw new Error()
		});
	})
}

/**
 * Returns initializating data for creating library
 * @param {string} path Path to the folder, where the context menu was opened
 */
function getComponentData(path: string): Promise<libraryCreator.initData> {
	return getPath(path, USER_INPUT_PLACEHOLDER.componentPath).then((libraryPath: string) => {
		return getComponentInitData(libraryPath).then((initData: libraryCreator.initData | void) => {
			if (initData) {
				return initData;
			}
			throw new Error()
		});
	})
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let library = vscode.commands.registerCommand('extension.createLibrary', (folder) => {
		// The code you place here will be executed every time your command is executed

		getLibraryData(folder?.fsPath).then((initData) => (new Creator(initData)).createLibrary()).catch(showError);
	});

	let extendedLibrary = vscode.commands.registerCommand('extension.createExtendedLibrary', (folder) => {
		// The code you place here will be executed every time your command is executed

		getLibraryData(folder?.fsPath).then((initData) => (new Creator(initData)).createExtLibrary()).catch(showError);
	});

	let component = vscode.commands.registerCommand('extension.addComponent', (folder) => {
		// The code you place here will be executed every time your command is executed

		getComponentData(folder?.fsPath).then((initData) => (new Creator(initData)).addComponent()).catch(showError);
	});

	context.subscriptions.push(library, extendedLibrary, component);
}

// this method is called when your extension is deactivated
export function deactivate() {}