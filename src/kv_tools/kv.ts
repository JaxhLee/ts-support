import * as vscode from 'vscode';
import * as request from 'request';
import * as fs from 'fs';
import { Response } from 'request';
import { KvProvider, kvNode } from './KVProvider';


const KV2TS_COMMAND = "tss.kvTools.kv2ts"
const KVREFRESH_COMMAND = "tss.kvTools.refresh"
const KVDOWNLOAD_COMMAND = "tss.kvTools.download"
const KVDOWNLOADALL_COMMAND = "tss.kvTools.downloadall"

export class kvtools {
	static Install(context: vscode.ExtensionContext) {
		// kv2ts
		const kv2ts = vscode.commands.registerCommand(KV2TS_COMMAND, () => {
			console.log('start get json');
			const uri = "http://localhost/index.php"

			const jsonUri = "http://localhost/pool/obj.json"
			let res = request.post(
				uri,
				{
					body: JSON.stringify({
						addon_name: "tui3",
						steamid: "484863393",
					})
				}
				,
				(error: any, response: Response, body: any) => {
					console.log(JSON.parse(body));

					if (vscode.workspace.rootPath) {
						const data = JSON.parse(body);
						console.log(data._js_path);
						const path = vscode.Uri.parse(data._js_path);
						fs.exists(path.path, (exists) => {
							if (!exists) {
								console.log('path not exist');
								return;
							}
							for (const fileName in data) {
								if (fileName == "_js_path") {
									continue
								}
								const json = data[fileName];
								const str = "GameUI." + fileName + " = " + json
								// fs.writeFile(path + fileName, str, (err: NodeJS.ErrnoException | null) => {
								// 	console.log('succend');
								// })
								console.log(333);

								console.log(str);

								console.log(data._js_path + fileName);

								fs.writeFileSync((data._js_path + fileName), str)
							}
						})
					}
				}
			)
			// res = fs.createReadStream('file.json').pipe(res)
			// fs.writeFile()
		})
		context.subscriptions.push(kv2ts);

		const kvProvider = new KvProvider(context)
		vscode.window.registerTreeDataProvider('kvdownloadExplorer', kvProvider);
		vscode.commands.registerCommand(KVREFRESH_COMMAND, () => kvProvider.refresh())


		const download = (file_path: string, js_path: string) => {
			const uri = "http://localhost/index.php"
			let res = request.post(
				uri + '?action=d1&mod=kv_ctx',
				{
					body: JSON.stringify({
						file_path: file_path,
					})
				},
				(error: any, response: Response, body: any) => {
					const path = file_path
					const fileName = path.slice(path.lastIndexOf('/') + 1, path.length)
					console.log((js_path + fileName));

					const str = "GameUI." + fileName + " = " + body
					console.log(str);

					fs.writeFileSync((js_path + fileName), str)
				}
			)
		}

		vscode.commands.registerCommand(KVDOWNLOAD_COMMAND, (node: kvNode) => {
			download(node.file_path, node.js_path)
		})
		vscode.commands.registerCommand(KVDOWNLOADALL_COMMAND, (...args) => {
			console.log('===========');
			console.log(args);
			// for (const k in args) {
			// 	const node = args[k];

			// 	download(node.file_path, node.js_path)
			// }
		})
	}
}