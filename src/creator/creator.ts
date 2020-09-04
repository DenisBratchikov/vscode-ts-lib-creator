import * as path from 'path';
import * as fs from 'fs';
import {
    getComponentContent, getInterfaceContent, getLibraryContent, getTemplateContent, getStylesContent, getLibraryStyles
} from './insertions';
import {showError} from '../utils';
import {getLibraryData, getComponentData} from './init';
import {IInitData, IConfig} from '.';

/**
 * Creates folder with given path 
 * @param {string} path Path with the folder name
 * @param {Function} callback Function, that will be called on success creation
 */
function createFolder(path: string, callback: Function): void {
    fs.mkdir(path, (err: Error | null): void | never => {
        if (err) {
            showError(err);
        } else {
            callback();
        }
    });
}

/**
 * Class for creating a library structure with next parts:
 * - library file
 * - component folder
 * - component main file (.ts)
 * - component style file (.less)
 * - component template file (.wml)
 * - component interface folder
 * - component interface file (.ts)
 * Component template and style can be packed in separate folder
 */
export default class {
    private readonly path: string;
    private readonly module: string;
    private readonly lib: string;
    private readonly component: string;
    private readonly isSeparateResources: boolean | undefined;
    private isExtLib: boolean | undefined;

    constructor(data: IInitData, {separateResources}: IConfig) {
        this.component = data.names.component;
        this.lib = data.names.lib;
        this.module = data.names.module;
        this.path = data.path;
        this.isSeparateResources = separateResources;
    }

    private createLibraryFolder(): void {
        createFolder(path.join(this.path, `_${this.lib}`), () => {
            if (this.isSeparateResources) {
                this.createResourcesFolder(() => this.createComponent());
                this.createInterfaceFile();
            } else {
                this.createComponent();
                this.createInterface();
            }
        });
    }

    private createLibraryStyles(): void {
        const libraryPath = path.join(this.path, `${this.lib}.less`);
        fs.writeFile(
            libraryPath,
            getLibraryStyles(this.module, this.lib, this.component, this.isSeparateResources, false),
            showError
        );
    }

    private createLibraryFile() : void {
        const libraryPath = path.join(this.path, `${this.lib}.ts`);
        fs.writeFile(
            libraryPath,
            getLibraryContent(this.module, this.lib, this.component, this.isSeparateResources),
            showError
        );
    }

    private createResourcesFolder(callback: Function): void {
        const separateFolderPath = path.join(this.path, `_${this.lib}`, this.component);
        createFolder(separateFolderPath, callback);
    }

    private createComponent(): void {
        this.createComponentFile();
        this.createComponentTemplate();
        this.createComponentStyles();
    }

    private createComponentFile(): void {
        const componentPath = path.join(this.path, `_${this.lib}`, `${this.component}.ts`);
        fs.writeFile(
            componentPath,
            getComponentContent(this.module, this.lib, this.component, this.isExtLib, this.isSeparateResources),
            showError
        );
    }

    private createComponentTemplate(): void {
        const resources = this.isSeparateResources ? [this.component, `${this.component}.wml`] : [`${this.component}.wml`];
        const templatePath = path.join(this.path, `_${this.lib}`, ...resources);
        fs.writeFile(templatePath, getTemplateContent(), showError);
    }

    private createComponentStyles(): void {
        const fileName = `${this.isExtLib ? '_' : ''}${this.component}.less`;
        const resources = this.isSeparateResources ? [this.component, fileName] : [fileName];
        const stylesPath: string = path.join(this.path, `_${this.lib}`, ...resources);
        fs.writeFile(stylesPath, getStylesContent(), showError);
    }

    private createInterface(): void {
        const interfaceDirPath = path.join(this.path, `_${this.lib}`, 'interface');
        fs.exists(interfaceDirPath, (exists) => {
            if (exists) {
                this.createInterfaceFile();
            } else {
                createFolder(interfaceDirPath, () => {
                    this.createInterfaceFile();
                });
            }
        });
    }

    private createInterfaceFile(): void {
        const interfacePath = path.join(
            this.path, `_${this.lib}`, this.isSeparateResources ? `${this.component}` : 'interface', `I${this.component}.ts`
        );
        fs.writeFile(
            interfacePath,
            getInterfaceContent(this.module, this.lib, this.component, this.isSeparateResources),
            showError
        );
    }

    private updateLibrary(): void {
        const libraryPath = path.join(this.path, `${this.lib}.ts`);
        fs.appendFile(
            libraryPath,
            getLibraryContent(this.module, this.lib, this.component, this.isSeparateResources, true),
            showError
        );
    }

    private updateLibraryStyles(): void {
        const libraryPath = path.join(this.path, `${this.lib}.less`);
        fs.appendFile(
            libraryPath,
            getLibraryStyles(this.module, this.lib, this.component, this.isSeparateResources, true),
            showError
        );
    }

    /**
     * Creates file structure for ts library
     */
    public createLibrary() {
        this.createLibraryFile();
        this.createLibraryFolder();
    }

    /**
     * Creates file structure for ts + less library
     */
    public createExtLibrary() {
        this.isExtLib = true;
        this.createLibrary();
        this.createLibraryStyles();
    }

    /**
     * Adds component to existing library (ts or ts + less)
     */
    public addComponent() {
        const libraryStylesPath = path.join(this.path, `${this.lib}.less`);
        fs.exists(libraryStylesPath, (exists: boolean) => {
            this.isExtLib = exists;
            if (this.isSeparateResources) {
                this.createResourcesFolder(() => this.createComponent());
                this.createInterfaceFile();
            } else {
                this.createComponent();
                this.createInterface();
            }
            this.updateLibrary();
            if (this.isExtLib) {
                this.updateLibraryStyles();
            }
        });
    }
}

export {
    getLibraryData,
    getComponentData
}
