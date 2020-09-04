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
 * @library
 * @includes ${component} ${module}/_${lib}/${component}
 * @includes I${component}Options ${module}/_${lib}/${isSeparateResources ? component : 'interface'}/I${component}
 * @public
 * @author
 */
`;
    const content = `
export {default as ${component}} from './_${lib}/${component}';
export {default as I${component}Options} from './_${lib}/${isSeparateResources ? component : 'interface'}/I${component}';`;
    return `${toAppend ? '' : comments}${content}`;
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
import * as template from 'wml!${module}/_${lib}/${component}${isSeparateResources ? `/${component}` : ''}';
import {default as I${component}Options} from './${isSeparateResources ? component : 'interface'}/I${component}';

/**
 * @class ${module}/${lib}:${component}
 * @extends UI/Base:Control
 * @author
 * @control
 * @public
 */

export default class ${component} extends Control<I${component}Options> {
    protected _template: TemplateFunction = template;

    protected _beforeMount(options: I${component}Options): Promise<void> | void {
        return;
    }

    // Подключаем файл стилей для компонента
    static _styles: string[] = ['${stylesPath}'];

    // Подключаем платформенные классы
    static _themes: string[] = ['Controls/Classes'];

    static getDefaultOptions(): I${component}Options {
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
export function getInterfaceContent(
    module: string, lib: string, component: string, isSeparateResources: boolean = false
): string {
    return `import {IControlOptions} from 'UI/Base';

/**
 * Интерфейс опций компонента ${module}/_${lib}/${component}
 * @interface ${module}/_${lib}/${isSeparateResources ? component : 'interface'}/I${component}
 * @extends UI/Base:IControlOptions
 */
export default interface I${component}Options extends IControlOptions {

}
`;
}
