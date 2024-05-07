import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let isActive = false;

    // Initial status bar message
    vscode.window.setStatusBarMessage(`🧘‍♂️ ZenComPrint: ${isActive ? 'ON' : 'OFF'}`);

    const hideDecorationType = vscode.window.createTextEditorDecorationType({
        textDecoration: 'none; display: none;', // Hides the text entirely - doesn't delete it!
    });

    const command = vscode.commands.registerCommand('zencomprint.toggleCommentsPrints', () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            return;
        }

        isActive = !isActive;
        updateTextVisibility(editor, isActive, hideDecorationType);
        vscode.window.setStatusBarMessage(`🧘‍♂️ ZenComPrint: ${isActive ? 'ON' : 'OFF'}`);
        
        // disable editor writeability if active
        if (isActive) {
            vscode.commands.executeCommand('workbench.action.files.setActiveEditorReadonlyInSession');
        } else {
            vscode.commands.executeCommand('workbench.action.files.setActiveEditorWriteableInSession');
        }
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
              case "al":
                validLanguage = true;
            case "groovy":
                validLanguage = true;    
              default:
                break;
            }

            // Hiding prints...
            if (languageId === 'javascript' || languageId === 'typescript') {
                if (text.includes('console.log') || text.includes('console.error') || text.includes('console.warn')) {
                    const range = new vscode.Range(i, 0, i, line.text.length);
                    decorationsArray.push({ range });
                }
            } else if (languageId === 'python') {
                if (text.match(/\bprint\(/)) {
                    const range = new vscode.Range(i, 0, i, line.text.length);
                    decorationsArray.push({ range });
                }
            } else if (languageId === 'groovy') {
                if (text.match(/\b(print(ln|f)?|System\.out\.print(ln|f)?)\(/)) {
                    const range = new vscode.Range(i, 0, i, line.text.length);
                    decorationsArray.push({ range });
                }
            }

            // Hiding comments...
            const commentIndex = text.indexOf('//');
        
            if (commentIndex !== -1 && (languageId === 'javascript' || languageId === 'typescript' || languageId === 'groovy')) {
                const range = new vscode.Range(i, commentIndex, i, line.text.length);
                decorationsArray.push({ range });
            }

            if (languageId === 'python') {
                const pythonCommentIndex = text.indexOf('#'); // Python single-line comments

                if (pythonCommentIndex !== -1) {
                    const range = new vscode.Range(i, pythonCommentIndex, i, line.text.length);
                    decorationsArray.push({ range });
                }
            }

            if (languageId === 'al') {
                const pythonCommentIndex = text.indexOf('//');

                if (pythonCommentIndex !== -1) {
                    const range = new vscode.Range(i, pythonCommentIndex, i, line.text.length);
                    decorationsArray.push({ range });
                }
            }
            
            if (!validLanguage) {
              vscode.window.showInformationMessage("ZenComPrint: Language not supported (...yet!)");
              break;
            }
        }
    }

    editor.setDecorations(hideDecorationType, decorationsArray);
}

export function deactivate() { }
