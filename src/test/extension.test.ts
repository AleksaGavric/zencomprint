import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Zencomprint Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests for Zencomprint.');

	test('Toggle Command Execution', async () => {
		const command = 'zencomprint.toggleCommentsPrints';
		await vscode.commands.executeCommand(command);

		assert.ok(true);
	});
});
