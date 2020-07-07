// Default init data for extension
export const DEFAULT_INIT_DATA: libraryCreator.initData = {
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
export const USER_INPUT_REG_EXPS: {[key in libraryCreator.TCreateEntity] : RegExp} = {
	library: /^(\w|\d)+\/(\w|\d)+$/i,
	component: /^(\w|\d)+?$/i
}
