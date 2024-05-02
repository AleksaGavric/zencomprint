import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Your extension "ZenComPrint" is now active!');

    let isActive = false;
    const hideDecorationType = vscode.window.createTextEditorDecorationType({
        textDecoration: 'none; display: none;', // Hides the text entirely
    });
    const command = vscode.commands.registerCommand('zencomprint.toggleCommentsPrints', () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            return;
        }

        isActive = !isActive;
        updateTextVisibility(editor, isActive, hideDecorationType);

        vscode.window.setStatusBarMessage(`🧘‍♂️ Prints & Comments: ${isActive ? 'ON' : 'OFF'}`);
    });

    context.subscriptions.push(command);
}

function updateTextVisibility(editor: vscode.TextEditor, isActive: boolean, hideDecorationType: vscode.TextEditorDecorationType) {
    const decorationsArray: vscode.DecorationOptions[] = [];
    if (isActive) {
        for (let i = 0; i < editor.document.lineCount; i++) {
            const line = editor.document.lineAt(i);
            const text = line.text;
            const languageId = editor.document.languageId;

            let validLanguage = false;
            switch (languageId) {
              case "javascript":
                validLanguage = true;
              case "typescript":
                validLanguage = true;
              case "python":
                validLanguage = true;
              default:
                break;
            }

            // Handle different print statements based on language
            if (languageId === 'javascript' || languageId === 'typescript') {
                // Hides lines containing JavaScript or TypeScript console.log
                if (text.includes('console.log') || text.includes('console.error') || text.includes('console.warn')) {
                    const range = new vscode.Range(i, 0, i, line.text.length);
                    decorationsArray.push({ range });
                }
            } else if (languageId === 'python') {
                // Hides lines containing Python print statements
                if (text.match(/\bprint\(/)) {
                    const range = new vscode.Range(i, 0, i, line.text.length);
                    decorationsArray.push({ range });
                }
            }

            // Hide comments, assuming single-line comments start with '//'
            const commentIndex = text.indexOf('//');
            if (commentIndex !== -1 && (languageId === 'javascript' || languageId === 'typescript')) {
                const range = new vscode.Range(i, commentIndex, i, line.text.length);
                decorationsArray.push({ range });
            }

            // Handle Python single-line comments
            if (languageId === 'python') {
                const pythonCommentIndex = text.indexOf('#');
                if (pythonCommentIndex !== -1) {
                    const range = new vscode.Range(i, pythonCommentIndex, i, line.text.length);
                    decorationsArray.push({ range });
                }
            }
            if (!validLanguage) {
              vscode.window.showInformationMessage("Language not supported");
              break;
            }
        }
    }

    editor.setDecorations(hideDecorationType, decorationsArray);
}

export function deactivate() { }
