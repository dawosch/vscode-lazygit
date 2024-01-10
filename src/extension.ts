import * as vscode from 'vscode';

function createQuickPick(items: vscode.QuickPickItem[]) {
  return new Promise<{ label: string; path: string }>((resolve, reject) => {
    const quickPick = vscode.window.createQuickPick();
    quickPick.items = items;
    quickPick.show();
    quickPick.onDidChangeSelection((selection) => {
      quickPick.hide();
      resolve(selection[0] as { label: string; path: string });
    });
  });
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('lazygit.open', async () => {
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 1) {
      const selection = await createQuickPick(vscode.workspace.workspaceFolders.map((wf) => ({ label: wf.name, path: wf.uri.fsPath })));
      if (selection) {
        const terminal = vscode.window.createTerminal({ location: 2 });
        terminal.sendText(`cd ${vscode.workspace.asRelativePath(selection.path)} && lazygit`);
      }
    } else {
      const terminal = vscode.window.createTerminal({ location: 2 });
      terminal.sendText('lazygit');
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
