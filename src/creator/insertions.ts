import * as os from 'os';

/**
 * Returns the library content
 * @param {string} module Module name
 * @param {string} lib Library name
 * @param {string} component Component name
 * @param {boolean} isSeparateResources Flag for placing file in separate folder
 * @param {boolean} toAppend Content for appending to existing library
 */
export function getLibraryContent(
    module: string, lib: string, component: string, isSeparateResources: boolean = false, toAppend: boolean = false
): string {
    const comments = `/**
 * @library ${module}/${lib}
 * @public
 * @author
 */
`;
    const content = `export {default as ${component}} from './_${lib}/${component}';
export {default as I${component}Options} from './_${lib}/${isSeparateResources ? component : 'interface'}/I${component}';
`;
    return `${toAppend ? '' : comments + '\n'}${content}`;
}

/**
 * Returns the library styles import
 * @param {string} module Module name
 * @param {string} lib Library name
 * @param {string} component Component name
 * @param {boolean} isSeparateResources Flag for placing file in separate folder
 * @param {boolean} toAppend Content for appending to existing library
 */
export function getLibraryStyles(
    module: string, lib: string, component: string, isSeparateResources: boolean = false, toAppend: boolean = false
): string {
    return `${toAppend ? os.EOL : ''}@import './_${lib}${isSeparateResources ? `/${component}` : ''}/_${component}.less';`;
}

/**
 * Returns the component content
 * @param {string} module Module name
 * @param {string} lib Library name
 * @param {string} component Component name
 * @param {boolean} isExtLib Flag of extended library: with less file
 * @param {boolean} isSeparateResources Flag for placing file in separate folder
 */
export function getComponentContent(
    module: string, lib: string, component: string, isExtLib: boolean = false, isSeparateResources: boolean = false
): string {
    let stylesPath: string;
    if (isExtLib) {
        stylesPath = `${module}/${lib}`;
    } else if (isSeparateResources) {
        stylesPath = `${module}/${lib}/${component}/${component}`;
    } else {
        stylesPath = `${module}/${lib}/${component}`;
    }
    return `import {Control, TemplateFunction} from 'UI/Base';
import {descriptor, DescriptorValidator} from 'Types/entity';

import {default as I${component}Options} from './${isSeparateResources ? component : 'interface'}/I${component}';

import * as template from 'wml!${module}/_${lib}/${component}${isSeparateResources ? `/${component}` : ''}';

import 'css!${stylesPath}';

/**
 * @author
 * @public
 */
export default class ${component} extends Control<I${component}Options> {
    protected _template: TemplateFunction = template;

    protected _beforeMount(options: I${component}Options): Promise<void> | void {
        return;
    }

    static getOptionTypes(): Partial<Record<keyof I${component}Options, DescriptorValidator>> {
        return {};
    }

    static get defaultProps(): I${component}Options {
        return {};
    }
}
`;
}

/**
 * Returns the content for template file (.wml)
 */
export function getTemplateContent(): string {
    return `<div class="%% namespace-ComponentName__blockName_modName_modValue %%"></div>`
}

/**
 * Returns the content for template file (.wml)
 */
export function getStylesContent(): string {
    return `.namespace-ComponentName__blockName_modName_modValue {}`;
}

/**
 * Returns the interface content
 * @param {string} module Module name
 * @param {string} lib Library name
 * @param {string} component Component name
 * @param {boolean} isSeparateResources Flag for placing file in separate folder
 */
export function getInterfaceContent(module: string, lib: string, component: string): string {
    return `import {IControlOptions} from 'UI/Base';

/**
 * Интерфейс опций компонента
 */
export default interface I${component}Options extends IControlOptions {

}
`;
}
