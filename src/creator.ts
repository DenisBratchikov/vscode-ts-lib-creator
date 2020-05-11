import * as path from 'path';
import * as fs from 'fs';
import {getComponentContent, getInterfaceContent, getLibraryContent} from './insertions';
import {showError} from './error';

/**
 * Class for creating a library structure with next parts:
 * - library file
 * - component folder
 * - component main file (.ts)
 * - component style file (.less)
 * - component template file (.wml)
 * - component interface folder
 * - component interface file (.ts)
 */
export class Creator {
    private _path: string;
    private _module: string;
    private _lib: string;
    private _component: string;

    constructor(data: libraryCreator.initData) {
        this._component = data.names.component;
        this._lib = data.names.lib;
        this._module = data.names.module;
        this._path = data.path;
    }

    /**
     * Root handler for creating library structure
     */
    async create() {
        fs.mkdir(path.join(this._path, `_${this._lib}`), (err: Error | null): void | never => {
            if (err) {
                showError(err);
            } else {
                this._createLibrary();
                this._createComponent();
                this._createTemplate();
                this._createStylesFile();
                this._createInterface();
            }
        });
    }

    /**
     * Creates a library file (.ts) with content and exports
     */
    private _createLibrary() : void {
        const libraryPath = path.join(this._path, `${this._lib}.ts`);
        fs.writeFile(libraryPath, getLibraryContent(this._module, this._lib, this._component), showError);
    }

    /**
     * Creates a component main file (.ts) with content
     */
    private _createComponent(): void {
        const componentPath = path.join(this._path, `_${this._lib}`, `${this._component}.ts`);
        fs.writeFile(componentPath, getComponentContent(this._module, this._lib, this._component), showError);
    }

    /**
     * Creates component template file (.wml)
     */
    private _createTemplate(): void {
        const templatePath = path.join(this._path, `_${this._lib}`, `${this._component}.wml`);
        fs.writeFile(templatePath, '', 'utf8', showError);
    }

    /**
     * Creates component style file (.less)
     */
    private _createStylesFile(): void {
        const stylesPath = path.join(this._path, `_${this._lib}`, `${this._component}.less`);
        fs.writeFile(stylesPath, '', 'utf8', showError);
    }

    /**
     * Creates component interface folder and file (.ts)
     */
    private _createInterface(): void {
        const interfaceDirPath = path.join(this._path, `_${this._lib}`, 'interface');
        fs.mkdir(interfaceDirPath, (err: Error | null): never | void => {
            if (err) {
                showError(err);
            } else {
                const interfacePath = path.join(interfaceDirPath, `I${this._component}.ts`);
                fs.writeFile(interfacePath, getInterfaceContent(this._module, this._lib, this._component), showError);
            }
        })
    }
}
