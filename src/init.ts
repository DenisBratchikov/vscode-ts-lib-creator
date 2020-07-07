import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import {ERRORS} from './error';
import {DEFAULT_INIT_DATA, USER_INPUT_PLACEHOLDER, USER_INPUT_REG_EXPS} from './constants';

/**
 * Returns absolute path to the module
 * @param {string} modulePath Path to the module
 * @param {string} placeHolder Placeholder for the dropdown
 */
export async function getPath(modulePath: string, placeHolder: string): Promise<string | never> {
    if (modulePath) {
        return modulePath;
    }
    const userInput: string | undefined = await vscode.window.showInputBox({ placeHolder });
    if (userInput && fs.existsSync(userInput)) {
        return userInput;
    }
    throw new Error(ERRORS.path);
}

/**
 * Returns valid initialization data for the creating library
 * @param {string} modulePath Path to the module
 */
export async function getLibraryInitData(modulePath: string): Promise<libraryCreator.initData | never> {
    const userInput: string | undefined = await getEntityName(USER_INPUT_PLACEHOLDER.libraryNames);
    const initData: libraryCreator.initData = collectLibraryData(userInput, modulePath);
    return checkPathExistence(initData.path).then(() => initData);
}

/**
 * Returns valid initialization data for the creating component in library
 * @param {string} modulePath Path to the module
 */
export async function getComponentInitData(modulePath: string): Promise<libraryCreator.initData | never> {
    const userInput: string | undefined = await getEntityName(USER_INPUT_PLACEHOLDER.componentName);
    const initData: libraryCreator.initData = collectComponentData(userInput, modulePath);
    return checkPathExistence(initData.path).then(() => initData);
}

/**
 * Returns user input - name creating entities
 * @param {string} placeHolder Placeholder for the dropdown
 */
function getEntityName(placeHolder: string): Thenable<string | undefined> {
    return vscode.window.showInputBox({ placeHolder });
}

/**
 * Parses user input and collects initialozation data for creating library
 * @param {string} userInput User input string
 * @param {string} moduleparsePath Path to the module
 */
function collectLibraryData(userInput: string | undefined, modulePath: string): libraryCreator.initData | never {
    if (!userInput || !USER_INPUT_REG_EXPS.library.test(userInput)) {
        throw new Error(ERRORS.userInput)
    }

    const names: string[] = userInput.split('/');
    const initData: libraryCreator.initData = DEFAULT_INIT_DATA;

    if (names.length === 2) {
        [initData.names.lib, initData.names.component] = names;
        initData.names.module = parsePath(modulePath).name;
        initData.path = modulePath
        return initData;
    } else {
        throw new Error(ERRORS.userInput)
    }
}

/**
 * Parses user input and collects initialozation data for creating component in library
 * @param {string} userInput User input string
 * @param {string} libraryPath Path to the library, where the component is creating
 */
function collectComponentData(userInput: string | undefined, libraryPath: string): libraryCreator.initData | never {
    if (!userInput || !USER_INPUT_REG_EXPS.component.test(userInput)) {
        throw new Error(ERRORS.userInput)
    }

    const initData: libraryCreator.initData = DEFAULT_INIT_DATA;
    const {name: libraryFolder, dir: modulePath} = parsePath(libraryPath);
    initData.names.component = userInput;
    initData.names.lib = libraryFolder.replace(/^_/, '');
    initData.path = modulePath;
    initData.names.module = parsePath(modulePath).name;
    return initData;
}

/**
 * Returns parsed path
 * @param {string} folderPath Absolute path to the folder (module or library)
 */
function parsePath(folderPath: string): path.ParsedPath {
    const parsedPath: path.ParsedPath = path.parse(folderPath);
    if (parsedPath.ext) {
        throw new Error(ERRORS.path);
    }
    return parsedPath;
}

/**
 * Checks path existence
 * @param {string} folderPath Absolute path to the folder (module or library)
 */
function checkPathExistence(folderPath: string): Promise<boolean | never> {
    return new Promise((resolve) => {
        fs.exists(folderPath, (exists: boolean) => {
            if (exists) {
                resolve(exists);
            }
            throw new Error(ERRORS.nonexistentPath)
        })
    });
}
