// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {Creator} from './creator';
import {getModulePath, getInitData} from './init';
import {showError} from './error';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let library = vscode.commands.registerCommand('extension.createLibrary', (folder) => {
		// The code you place here will be executed every time your command is executed

		getModulePath(folder?.fsPath).then((modulePath: string) => {
			return getInitData(modulePath).then((initData: libraryCreator.initData | void) => {
				if (initData) {
					(new Creator(initData)).create();
				}
			});
		}).catch(showError)
	});

	let component = vscode.commands.registerCommand('extension.createComponent', (folder) => {
		// The code you place here will be executed every time your command is executed

		getModulePath(folder?.fsPath).then((modulePath: string) => {
			return getInitData(modulePath).then((initData: libraryCreator.initData | void) => {
				if (initData) {
					(new Creator(initData)).create();
				}
			});
		}).catch(showError)
	});

	context.subscriptions.push(library, component);
}

// this method is called when your extension is deactivated
export function deactivate() {}