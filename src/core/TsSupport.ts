import * as vscode from 'vscode';
import * as SMS from 'source-map-support';
import { TTSCnf } from './conf';
export class TsSupport {
	/** install TsSupport */
	static Install(context: vscode.ExtensionContext) {
		// install source map support.

		// handleUncaughtExceptions?: boolean;
		// hookRequire ?: boolean;
		// emptyCacheBetweenOperations ?: boolean;
		// environment ?: 'auto' | 'browser' | 'node';
		// overrideRetrieveFile ?: boolean;
		// overrideRetrieveSourceMap ?: boolean;
		// retrieveFile ? (path: string): string;
		// retrieveSourceMap ? (source: string): UrlAndMap | null;
		const options: SMS.Options = {
			hookRequire: false,
			handleUncaughtExceptions: false,
			// overrideRetrieveFile: true,
			// overrideRetrieveSourceMap: true
		};

		// SMS.install();

		this.regEvt(context);
	}

	private static regEvt(context: vscode.ExtensionContext) {
		// let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// 	vscode.window.showInformationMessage('Hello World!');
		// });

		// context.subscriptions.push(disposable);

		let disposable = vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'javascript' }, new GoTSDefinitionProvider());
		context.subscriptions.push(disposable);
		// disposable = vscode.languages.registerHoverProvider({ scheme: 'file', language: 'javascript' }, new GoTSHoverProvider());
		// context.subscriptions.push(disposable);
	}
}

class GoTSDefinitionProvider implements vscode.DefinitionProvider {
	provideDefinition(doc: vscode.TextDocument, pos: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location | vscode.Location[] | vscode.LocationLink[]> {
		if (doc.languageId === "javascript") {

			const targetPos = SMS.mapSourcePosition({
				source: doc.fileName,
				line: pos.line,
				column: pos.character
			});

			const destPath = targetPos.source;
			const line = targetPos.line;
			const character = targetPos.column;

			return new vscode.Location(vscode.Uri.file(destPath), new vscode.Position(line, character));
		}
	}
}

class GoTSHoverProvider implements vscode.HoverProvider {
	provideHover(doc: vscode.TextDocument, pos: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
		if (doc.languageId === "javascript") {

			const targetPos = SMS.mapSourcePosition({
				source: doc.fileName,
				line: pos.line,
				column: pos.character
			});

			// let destPath: any = targetPos.source;
			// destPath = vscode.Uri.file(targetPos.source);
			// const line = targetPos.line;
			// const character = targetPos.column;

			// let hoverMd = "[to ts def](" + destPath + ")";
			// hoverMd = "[" + destPath + "](" + destPath + ")";

			// return new vscode.Hover([hoverMd]);

			const destPath = targetPos.source;
			const line = targetPos.line;
			const character = targetPos.column;

			const location = new vscode.Location(vscode.Uri.file(destPath), new vscode.Position(line, character));
			return new vscode.Hover(["[" + location.uri + "](" + location.uri + ")"]);
		}
	}
}
