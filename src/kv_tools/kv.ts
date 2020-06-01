import * as vscode from 'vscode';
import * as request from 'request';
import * as fs from 'fs';
import { Response } from 'request';


const KV2TS_COMMAND = "tss.kvTools.kv2ts"

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
	}
}