import * as path from 'path';
import * as fs from 'fs';
import {
    getComponentContent, getInterfaceContent, getLibraryContent, getTemplateContent, getStylesContent, getLibraryStyles
} from './insertions';
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
    private _isExtLib: boolean | undefined;

    constructor(data: libraryCreator.initData) {
        this._component = data.names.component;
        this._lib = data.names.lib;
        this._module = data.names.module;
        this._path = data.path;
    }

    private _createLibraryFolder(): void {
        fs.mkdir(path.join(this._path, `_${this._lib}`), (err: Error | null): void | never => {
            if (err) {
                showError(err);
            } else {
                this._createComponent();
                this._createTemplate();
                this._createStylesFile();
                this._createInterface();
            }
        });
    }

    private _createLibraryStyles(): void {
        const libraryPath = path.join(this._path, `${this._lib}.less`);
        fs.writeFile(libraryPath, getLibraryStyles(this._module, this._lib, this._component), showError);
    }

    private _createLibraryFile() : void {
        const libraryPath = path.join(this._path, `${this._lib}.ts`);
        fs.writeFile(libraryPath, getLibraryContent(this._module, this._lib, this._component), showError);
    }

    private _createComponent(): void {
        const componentPath = path.join(this._path, `_${this._lib}`, `${this._component}.ts`);
        fs.writeFile(componentPath, getComponentContent(this._module, this._lib, this._component, this._isExtLib), showError);
    }

    private _createTemplate(): void {
        const templatePath = path.join(this._path, `_${this._lib}`, `${this._component}.wml`);
        fs.writeFile(templatePath, getTemplateContent(), showError);
    }

    private _createStylesFile(): void {
        const stylesPath: string = path.join(
            this._path, `_${this._lib}`, `${this._isExtLib ? '_' : ''}${this._component}.less`
        );
        fs.writeFile(stylesPath, getStylesContent(), showError);
    }

    private _createInterface(): void {
        const interfaceDirPath = path.join(this._path, `_${this._lib}`, 'interface');
        fs.exists(interfaceDirPath, (exists) => {
            if (exists) {
                this._createInterfaceFile();
            } else {
                fs.mkdir(interfaceDirPath, (err: Error | null): never | void => {
                    if (err) {
                        showError(err);
                    } else {
                        this._createInterfaceFile();
                    }
                });
            }
        });
    }

    private _createInterfaceFile(): void {
        const interfacePath = path.join(this._path, `_${this._lib}`, 'interface', `I${this._component}.ts`);
        fs.writeFile(interfacePath, getInterfaceContent(this._module, this._lib, this._component), showError);
    }

    private _updateLibrary(): void {
        const libraryPath = path.join(this._path, `${this._lib}.ts`);
        fs.appendFile(libraryPath, getLibraryContent(this._module, this._lib, this._component, true), showError);
    }

    private _updateLibraryStyles(): void {
        const libraryPath = path.join(this._path, `${this._lib}.less`);
        fs.appendFile(libraryPath, getLibraryStyles(this._module, this._lib, this._component, true), showError);
    }

    /**
     * Creates file structure for ts library
     */
    public createLibrary() {
        this._createLibraryFile();
        this._createLibraryFolder();
    }

    /**
     * Creates file structure for ts + less library
     */
    public createExtLibrary() {
        this._isExtLib = true;
        this.createLibrary();
        this._createLibraryStyles();
    }

    /**
     * Adds component to existing library (ts or ts + less)
     */
    public addComponent() {
        const libraryStylesPath = path.join(this._path, `${this._lib}.less`);
        fs.exists(libraryStylesPath, (exists: boolean) => {
            this._isExtLib = exists;

            this._createComponent();
            this._createTemplate();
            this._createStylesFile();
            this._createInterface();

            this._updateLibrary();
            if (this._isExtLib) {
                this._updateLibraryStyles();
            }
        });
    }
}
