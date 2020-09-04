/**
 * Configuration for creator
 * @interface
 * @property {boolean} separateResources Flag for using separate folder for component resources
 */
export interface IConfig {
   separateResources: boolean;
}

/**
 * Extension initialization data
 * @interface
 * @property {INames} names Names, required for creating a library
 * @property {string} path Path to the module
 */
export interface IInitData {
   names: INames;
   path: string;
}

/**
 * Extension initialization data
 * @interface
 * @property {string} module Module name, where the library is creating
 * @property {string} lib Library name
 * @property {string} component Exporting from the library component name
 */
interface INames {
   module: string;
   lib: string;
   component: string;
}
