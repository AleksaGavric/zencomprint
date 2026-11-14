import * as vscode from 'vscode';
import { hiddenLineNumbers, supports } from './visibility';

export function activate(context: vscode.ExtensionContext) {
    const hiddenDocuments = new Set<string>();
    const decoration = vscode.window.createTextEditorDecorationType({ textDecoration: 'none; display: none;' });
    const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    status.command = 'zencomprint.toggleCommentsPrints';
    status.tooltip = 'Toggle comment and diagnostic-output visibility in this document';

    const updateEditor = (editor: vscode.TextEditor) => {
        const active = hiddenDocuments.has(editor.document.uri.toString());
        const lines = active ? hiddenLineNumbers(editor.document.getText().split(/\r?\n/), editor.document.languageId) : [];
        editor.setDecorations(decoration, lines.map(line => editor.document.lineAt(line).range));
    };
    const updateStatus = () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !supports(editor.document.languageId)) { status.hide(); return; }
        status.text = `ZenComPrint: ${hiddenDocuments.has(editor.document.uri.toString()) ? 'ON' : 'OFF'}`;
        status.show();
    };
    const command = vscode.commands.registerCommand('zencomprint.toggleCommentsPrints', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }
        if (!supports(editor.document.languageId)) {
            void vscode.window.showInformationMessage('ZenComPrint: this language is not supported.');
            return;
        }
        const key = editor.document.uri.toString();
        if (hiddenDocuments.has(key)) { hiddenDocuments.delete(key); }
        else { hiddenDocuments.add(key); }
        for (const visible of vscode.window.visibleTextEditors) {
            if (visible.document.uri.toString() === key) { updateEditor(visible); }
        }
        updateStatus();
    });
    context.subscriptions.push(decoration, status, command,
        vscode.window.onDidChangeActiveTextEditor(updateStatus),
        vscode.window.onDidChangeVisibleTextEditors(editors => { editors.forEach(updateEditor); updateStatus(); }),
        vscode.workspace.onDidChangeTextDocument(event => {
            for (const editor of vscode.window.visibleTextEditors) {
                if (editor.document === event.document) { updateEditor(editor); }
            }
        }),
        vscode.workspace.onDidCloseTextDocument(document => { hiddenDocuments.delete(document.uri.toString()); })
    );
    updateStatus();
}
