import * as vscode from 'vscode';
import * as fs from 'fs';
import {ERRORS} from './error';
import {DEFAULT_INIT_DATA} from './constants';

// Reg exp for extracting module name from config file
const REG_EXP_ROOT_MODULE_DIR = /(\w|\d)+$/ig;

// Reg exp for testing user input
const REG_EXP_TEST_USER_INPUT = /^(\w|\d)+\/(\w|\d)+(\/(\w|\d)+)?$/ig;

/**
 * Returns absolute path to the module
 * @param {string} modulePath Path to the module
 */
export async function getModulePath(modulePath: string): Promise<string | never> {
    if (modulePath) {
        return modulePath;
    }
    const userInput: string | undefined = await vscode.window.showInputBox({
        placeHolder: 'Module absolute path'
    });
    if (userInput && fs.existsSync(userInput)) {
        return userInput;
    }
    throw new Error(ERRORS.incorrectPath);
}

/**
 * Returns valid initialization data for the creator
 * @param {string} modulePath Path to the module
 */
export async function getInitData(modulePath: string): Promise<libraryCreator.initData | never> {
    const userInput: string | undefined = await vscode.window.showInputBox({
        placeHolder: 'Library name/Component name'
    });
    const initData: libraryCreator.initData = collectData(checkUserInput(userInput), modulePath);
    return initData;
}

/**
 * Parses user input and collects initialozation data
 * @param {string} userInput User input string
 * @param {string} modulePath Path to the module
 */
function collectData(userInput: string, modulePath: string): libraryCreator.initData | never {
    const names: string[] = userInput.split('/');
    const initData: libraryCreator.initData = DEFAULT_INIT_DATA;
    if (names.length === 2) {
        [initData.names.lib, initData.names.component] = names;
        initData.names.module = parsePath(modulePath);
        initData.path = modulePath
    } else {
        throw new Error(ERRORS.userInput)
    }
    return initData;
}

/**
 * Returns module name from configuration file
 * @param {string} modulePath Path to directory for resolving library
 * @remark Executes when user inputs 2 names (library and component)
 */
function parsePath(modulePath: string): string {
    const match = modulePath.match(REG_EXP_ROOT_MODULE_DIR);
    if (match?.length) {
        return match[0];
    } else {
        throw new Error(ERRORS.moduleName);
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
