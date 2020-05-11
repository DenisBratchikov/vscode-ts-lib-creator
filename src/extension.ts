// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import {Creator} from './creator';
import {getInitData} from './init';
import {DEFAULT_CONFIG, CONFIG_FILE} from './constants';
import {showError} from './error';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.createLibrary', () => {
		// The code you place here will be executed every time your command is executed

		const rootPath = vscode.workspace.rootPath;
		if (rootPath) {
			fs.readFile(path.join(rootPath, CONFIG_FILE), 'utf8', async (err, content) => {
				let config: libraryCreator.config;
				if (content) {
					config = JSON.parse(content);
				} else {
					config = DEFAULT_CONFIG;
				}
				const initData: libraryCreator.initData | void = await getInitData(config, rootPath).catch(showError);
				if (initData) {
					(new Creator(initData)).create();
				}
			})
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}