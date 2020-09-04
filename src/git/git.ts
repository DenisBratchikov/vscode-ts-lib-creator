import * as vscode from 'vscode';
import * as crypto from 'crypto';
import {Repository, IConfig, IGitError} from '.';
import {ERRORS, PLACEHOLDERS, RC_MASK, TASK_MASK, RANDOM_BYTES_LENGTH, SUCCESS_MESSAGE} from './constants';

// Cache current repository
let repository: Repository;

/**
 * Returns current project repository
 */
export async function getRepo(): Promise<Repository> {
    if (!repository) {
        const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
        repository = await gitExtension.getRepositories().then(([repo]: Repository[]) => repo);
    }
    return repository;
}

/**
 * Returns text from user input
 * @param {string} placeHolder Tip for user
 */
async function getUserInput(placeHolder: string): Promise<string | never> {
    return vscode.window.showInputBox({ placeHolder }).then((userInput) => {
        if (userInput) {
            return userInput;
        }
        throw new Error(ERRORS.emptyUserInput);
    });
}

/**
 * Returns branch name depend on branch name source
 * @param {IConfig['branchNameSource']} branchNameSource Branch source
 */
async function getBranchName(branchNameSource: IConfig['branchNameSource']): Promise<string | never> {
    switch (branchNameSource) {
        case 'popup':
            return getUserInput(PLACEHOLDERS.branch);
        case 'clipboard':
            return vscode.env.clipboard.readText();
        case 'random':
        default:
            return crypto.randomBytes(RANDOM_BYTES_LENGTH).toString('hex');
    }
}

/**
 * Return data for checkout, commit and push commands
 * @param repo Current repository class
 * @param config Extension config from configuration file
 */
async function getData(
    repo: Repository, {branchPrefix, branchNameSource, strictMode}: IConfig
): Promise<[string, string, string | undefined]> {
    if (!repo) {
        throw new Error(ERRORS.repo);
    }
    const state = repo.state;
    const remoteUrl = (state.remotes || [])[0]?.pushUrl;
    if (!remoteUrl) {
        throw new Error(ERRORS.remoteUrl);
    }
    const currentBranch = state.HEAD?.name;
    if (!currentBranch) {
        throw new Error(ERRORS.currentBranch);
    }
    const [rcBranch, rcVersion]: string[] = currentBranch.match(RC_MASK) || [];
    if (!rcVersion && strictMode) {
        throw new Error(ERRORS.wrongCurrentBranch);
    }
    const branchName = rcVersion ? `${rcVersion}/${branchPrefix}/${getBranchName(branchNameSource)}` : currentBranch;
    return [remoteUrl, branchName, rcBranch];
}

/**
 * Returns commit message from clipboard or (if fails) from user input
 */
async function getCommitMessage(): Promise<string | never> {
    return vscode.env.clipboard.readText().then(text => {
        if (!text || !TASK_MASK.test(text)) {
            return getUserInput(PLACEHOLDERS.commit);
        }
        return text;
    });
}

/**
 * Throws error when git command fails
 * @param {IGitError} error Git error class
 */
function throwGitError(error: IGitError): never {
    throw new Error(error.stderr || error.stdout);
}

/**
 * Handler for committing changes and pushing information to remote repository
 * @param {string} repo Current repository class
 * @param {string} message Commit message
 * @param {string} remoteUrl Remote repository url
 * @param {string} branchName Pushing branch name
 */
async function commitAndPush(repo: Repository, message: string, remoteUrl: string, branchName: string): Promise<void> {
    await repo.commit(message, {all: 'tracked'}).catch(throwGitError);
    await repo.push(remoteUrl, branchName).catch(throwGitError);
}

/**
 * Executes checkout, commit and push from rc branch
 * @param repo Current repository class
 * @param config Extension config from configuration file
 */
export default async (repo: Repository, config: IConfig) => {
    const [remoteUrl, branchName, rcBranch] = await getData(repo, config);
    const commitMessage = await getCommitMessage();
    if (rcBranch) {
        await repo.pull().catch(throwGitError);
        await repo.createBranch(branchName, true).catch(throwGitError);
        await commitAndPush(repo, commitMessage, remoteUrl, branchName);
        await repo.checkout(rcBranch);
    } else {
        await commitAndPush(repo, commitMessage, remoteUrl, branchName);
    }
    await vscode.env.clipboard.writeText(branchName);
    vscode.window.showInformationMessage(`${SUCCESS_MESSAGE} "${rcBranch || branchName}"`);
}
