import {IFileConfig} from ".";
import * as os from 'os';

// Error messages for user
export enum ERRORS {
    workspaceFolder = 'Can not define workspace folder',
    invalidFile = 'Can not parse configuration file'
}

// Configuration file default name
export const CONFIG_FILE_NAME = 'tensor.config.json';

// Default config (when file was not found)
export const DEFAULT_CONFIG: IFileConfig = {
    creator: {
        separateResources: false
    },
    git: {
        branchPrefix: os.userInfo.name,
        branchNameSource: 'clipboard',
        strictMode: false
    }
};