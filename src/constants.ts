// Config file name
export const CONFIG_FILE = 'tensor.lib.json';

// Default config for extension (if config file does not exists)
export const DEFAULT_CONFIG: libraryCreator.config = {
	rootDir: ''
};

// Default init data for extension
export const DEFAULT_INIT_DATA: libraryCreator.initData = {
	names: {
		module: '',
		component: '',
		lib: ''
	},
	path: ''
};
