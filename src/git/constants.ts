// RegExp for checking branch
export const RC_MASK = /rc-(\d{2}\.\d{4})/i;

// RegExp for checking correct task url
export const TASK_MASK = /^https.*opendoc\.html\?guid=(.*)/i;

// Message for successed commit and push
export const SUCCESS_MESSAGE = 'You done it! Branch name copied to clipboard. You are on branch';

// Length for crypto random bytes
export const RANDOM_BYTES_LENGTH = 20;

// Placeholders for user input
export enum PLACEHOLDERS {
	branch = 'Branch name after prefix',
	commit = 'Commit message'
}

// Error messages for user
export enum ERRORS {
	repo = 'Extension is not initialized yet. Try again later',
	remoteUrl = 'Can not get remote url',
	currentBranch = 'Can not get current branch name',
	emptyUserInput = 'Popup dialog is empty',
	wrongCurrentBranch = 'You must checkout on release candidate branch'
}
