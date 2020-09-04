import {IConfig, IInitData} from '.';

// Default init data for extension
export const DEFAULT_INIT_DATA: IInitData = {
	names: {
		module: '',
		component: '',
		lib: ''
	},
	path: ''
};

// Placeholder text depend on creating entity
export const USER_INPUT_PLACEHOLDER = {
	libraryNames: 'Library name/Component name',
	libraryPath: 'Module absolute path',
	componentName: 'Component name',
	componentPath: 'Library absolute path'
}

// RegExps for checkings user input
export const USER_INPUT_REG_EXPS = {
	library: /^(\w|\d)+\/(\w|\d)+$/i,
	component: /^(\w|\d)+?$/i
}

// Error messages for user
export enum ERRORS {
	initData = 'Can not get init data',
	path = 'Incorrent path',
	userInput = 'Component and Library names were not filled correctly',
	nonexistentPath = 'Collected module path does not exists'
}
