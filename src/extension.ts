// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Creator, {getLibraryData, getComponentData} from './creator/creator';
import executeGitExtension, {getRepo} from './git/git';
import getLink from './link/link';
import {showError, getConfig} from './utils';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const library = vscode.commands.registerCommand('extension.createLibrary', (folder) => {
		// The code you place here will be executed every time your command is executed

		Promise.all([
			getLibraryData(folder?.fsPath),
			getConfig()
		]).then(([initData, {creator}]) => (new Creator(initData, creator)).createLibrary()).catch(showError);
	});

	const extendedLibrary = vscode.commands.registerCommand('extension.createExtendedLibrary', (folder) => {
		Promise.all([
			getLibraryData(folder?.fsPath),
			getConfig()
		]).then(([initData, {creator}]) => (new Creator(initData, creator)).createExtLibrary()).catch(showError);
	});

	const component = vscode.commands.registerCommand('extension.addComponent', (folder) => {
		Promise.all([
			getComponentData(folder?.fsPath),
			getConfig()
		]).then(([initData, {creator}]) => (new Creator(initData, creator)).addComponent()).catch(showError);
	});

	const tensorGit = vscode.commands.registerCommand('extension.tensorGit', () => {
		Promise.all([
			getRepo(),
			getConfig()
		]).then(([repo, {git}]) => executeGitExtension(repo, git)).catch(showError);
	});

	const componentDoc = vscode.commands.registerCommand('extension.openComponentDoc', () => getLink());

	context.subscriptions.push(library, extendedLibrary, component, tensorGit, componentDoc);
}

// this method is called when your extension is deactivated
export function deactivate() {}
