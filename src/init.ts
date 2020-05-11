import * as vscode from 'vscode';
import * as path from 'path';
import {ERRORS} from './error';
import {DEFAULT_INIT_DATA} from './constants';

// Reg exp for extracting module name from config file
const REG_EXP_ROOT_MODULE_DIR = /(\w|\d)+$/ig;

// Reg exp for testing user input
const REG_EXP_TEST_USER_INPUT = /^(\w|\d)+\/(\w|\d)+(\/(\w|\d)+)?$/ig;

/**
 * Returns valid initialization data for the creator
 * @param {string} config Configuration file content
 * @param {string} rootPath Path to the project directory
 */
export async function getInitData(config: libraryCreator.config, rootPath: string): Promise<libraryCreator.initData | never> {
    const userInput: string | undefined = await vscode.window.showInputBox();
    const initData: libraryCreator.initData = collectData(checkUserInput(userInput), config.rootDir, rootPath);
    return initData;
}

/**
 * Parses user input and collects initialozation data
 * @param {string} userInput User input string
 * @param {string} rootDir Path to directory for resolving library
 * @param {string} rootPath Path to the project directory
 */
function collectData(userInput: string, rootDir: string, rootPath: string): libraryCreator.initData | never {
    const names: string[] = userInput.split('/');
    const initData: libraryCreator.initData = DEFAULT_INIT_DATA;
    switch (names.length) {
        case 2:
            [initData.names.lib, initData.names.component] = names;
            initData.names.module = parsePath(rootDir) || parsePath(rootPath);
            initData.path = getModulePath(rootDir);
            break;
        case 3:
            [initData.names.module, initData.names.lib, initData.names.component] = names;
            initData.path = path.join(getModulePath(rootDir), initData.names.module);
            break;
        default:
            throw new Error(ERRORS.userInput)
    }
    return initData;
}

/**
 * Returns module name from configuration file
 * @param {string} rootDir Path to directory for resolving library
 * @remark Executes when user inputs 2 names (library and component)
 */
function parsePath(rootDir: string): string {
    const match = rootDir.match(REG_EXP_ROOT_MODULE_DIR);
    if (match?.length) {
        return match[0];
    } else {
        return '';
    }
}

/**
 * Returns user input if it is valid otherwise throws error
 * @param {string | undefined} userInput User input string
 */
function checkUserInput(userInput: string | undefined): string | never {
    if (!userInput) {
        throw new Error(ERRORS.userInput);
    } else if (!userInput.match(REG_EXP_TEST_USER_INPUT)) {
        throw new Error(ERRORS.initName);
    }
    return userInput
}

/**
 * Returns path to the module from configuration file
 * @param {string} rootDir Path to directory for resolving library
 */
function getModulePath(rootDir: string): string | never {
    const projectPath = vscode.workspace.rootPath;
    if (projectPath) {
        return path.join(projectPath, rootDir);
    } else {
        throw new Error(ERRORS.vscodeRootPath)
    }
}