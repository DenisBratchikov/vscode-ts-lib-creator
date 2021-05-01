import * as vscode from 'vscode';

// Documentation site URL
const WI_URL = 'https://wi.sbis.ru/docs/js/';

// Opens the documentation of selected component
export default () => {
    const activeTextEditor = vscode.window.activeTextEditor;
    if (!activeTextEditor) {
        return;
    }

    const rawData = getRawData(activeTextEditor);
    if (!rawData) {
        return;
    }

    const controlUrl = getComponentName(rawData).replace(/[\.:]/g, '/');
    const uri = vscode.Uri.parse(`${WI_URL}${controlUrl}`);
    vscode.env.openExternal(uri)
}

/**
 * Returns component name from raw selected string
 * @param rawData Selected string
 */
function getComponentName(rawData: string): string {
    return rawData.replace(/\s*(<|<\/)?(ws:partial template="|template=")?(.*?)"?(\s.*)?"?\s*(\/>|>)?\s*$/g, '$3');
}

/**
 * Returns data for parsing component name
 * @param activeEditor Current active text editor
 */
function getRawData(activeEditor: vscode.TextEditor): string {
    const document = activeEditor.document;
    let result = document.getText(activeEditor.selection);
    if (result) {
        return result;
    }
    const position = activeEditor.selection.active;
    const startPosition = position.with(position.line, 0);
    const endPosition = position.with(position.line, 999);
    const selection = new vscode.Selection(startPosition, endPosition);
    result = document.getText(selection);
    return result;
}
