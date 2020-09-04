import {IConfig as ICreatorConfig} from './creator';
import {IConfig as IGitConfig} from './git';

/**
 * Configuration file interface
 * @interface
 * @property {ICreatorConfig} creator Configuration for library structure creator extension
 * @property {IGitConfig} git Configuration for git extension
 */
export interface IFileConfig {
   creator: ICreatorConfig;
   git: IGitConfig;
}