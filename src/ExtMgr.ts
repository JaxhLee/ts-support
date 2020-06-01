import * as vscode from "vscode";
import * as rd from "rd";
import CompileLessCommand = require("./easy_less/src/CompileLessCommand");
import easyless = require("./easy_less/src/easyLess");
import { TsSupport } from "./core/tss";
import { kvtools } from "./kv_tools/kv";

export class ExtMgr {
	static lessDiagnosticCollection = vscode.languages.createDiagnosticCollection();
	static Install(context: vscode.ExtensionContext) {
		// 右键编译文件夹下所有less
		const compileLessFiles = vscode.commands.registerCommand("tss.compileLessFiles", (e) => {
			var path = e.fsPath;
			var count = 0;
			rd.each(path, function (f, s, next) {
				if (s.isFile()) {
					var ex = f.substring(f.lastIndexOf("."), f.length);
					if (ex === ".less") {
						// UTF-8 Without BOM
						vscode.workspace.openTextDocument(vscode.Uri.file(f)).then(doc => {
							new CompileLessCommand(doc, ExtMgr.lessDiagnosticCollection).execute();
						}).then(function (event) {
						}, function (reason) {
						});
						count++;
					}
				}
				next();
			}, function (err) {
				if (err) {
					console.log("CompileAll: count = " + count + ", error = " + err);
				}
				else {
					var str;
					if (count <= 1) {
						str = "Compile " + count + " less file success.";
					}
					else {
						str = "Compile " + count + " less files success.";
					}
					vscode.window.showInformationMessage(str);
				}
			});
		});
		context.subscriptions.push(compileLessFiles);

		easyless.activate(context);
		// Tss 跳转扩展 install
		TsSupport.Install(context);

		kvtools.Install(context);
	}

	static Uninstall() {
		easyless.deactivate();
	}
}