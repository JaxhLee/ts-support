"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExtMgr_1 = require("./ExtMgr");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "ts-support" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    // let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
    // 	// The code you place here will be executed every time your command is executed
    // 	// Display a message box to the user
    // 	vscode.window.showInformationMessage('Hello World!');
    // });
    // context.subscriptions.push(disposable);
    ExtMgr_1.ExtMgr.Install(context);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    ExtMgr_1.ExtMgr.Uninstall();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map