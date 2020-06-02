import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as request from 'request';

interface kvlist {
	[addonname: string]: { files: string[], js_path: string }
}

export interface kvNode {
	js_path: string
	file_path: string
	type: 'addon' | 'file'
}

export class KvProvider implements vscode.TreeDataProvider<kvNode> {
	list: kvlist | null = null

	private _onDidChangeTreeData: vscode.EventEmitter<kvNode | null> = new vscode.EventEmitter<kvNode | null>();
	readonly onDidChangeTreeData: vscode.Event<kvNode | null> = this._onDidChangeTreeData.event;

	constructor(context: vscode.ExtensionContext) {
		// this.request()
	}

	refresh(kvNode?: kvNode): void {
		if (kvNode) {
			this._onDidChangeTreeData.fire(kvNode);
		} else {
			this._onDidChangeTreeData.fire(null);
		}
	}

	async request() {
		return new Promise(resolve => {
			const url = "http://localhost/index.php"
			const req = request.post(
				url + '?action=list&mod=kv_ctx',
				{
					body: JSON.stringify({
						steamid: "1",
					})
				},
				((error: any, response: request.Response, body: any) => {
					if (response.statusCode == 200) {
						const data = JSON.parse(body);
						console.log('Hello');

						console.log(data);
						this.list = {}
						for (const addonname in data) {
							const v = data[addonname];
							this.list[addonname] = {
								files: v.files,
								js_path: v._index.file_path
							}
						}
						console.log(this.list);

						resolve(1);
					}
					console.log(333);

				}).bind(this)
			)
		})
	}

	getFiles(addonname: string): kvNode[] {
		const res: kvNode[] = []
		if (this.list && this.list[addonname]) {
			const js_path = this.list[addonname].js_path
			const files = this.list[addonname].files
			for (const k in files) {
				const file_path = files[k];
				res.push({ type: "file", file_path: file_path, js_path: js_path })
			}
		}
		return res
	}

	getAddons(): kvNode[] {
		const res: kvNode[] = []
		for (const addonname in this.list) {
			res.push({ type: "addon", file_path: addonname, js_path: "" })
		}
		return res
	}

	getTreeItem(element: kvNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
		console.log(222);
		let treeItem: vscode.TreeItem = new vscode.TreeItem(element.file_path, element.type == "addon" ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
		if (element.type == "addon") {
			let files: any = this.getFiles(element.file_path)
			// files = Promise.resolve(files)
			console.log("files");

			console.log(files);

			treeItem.command = {
				command: 'tss.kvTools.downloadall',
				title: 'downloadall333',
				arguments: [1, 2, 3]
			};
		} else if (element.type == "file") {
			treeItem.command = {
				command: 'tss.kvTools.download',
				title: 'download',
				arguments: [element]
			};
		}

		// treeItem.iconPath = this.getIcon(valueNode);
		treeItem.contextValue = element.type;
		return treeItem;
	}

	async getChildren(element?: kvNode | undefined): Promise<kvNode[]> {
		console.log(333);
		if (element) {
			if (element.type == "addon") {
				const files = this.getFiles(element.file_path)
				return Promise.resolve(files)
			}
			return Promise.resolve([element]);
		} else {
			await this.request();
			console.log('9999');

			const addons = this.getAddons()
			return Promise.resolve(addons);
		}
	}
}

class kvpath extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		private version: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState
	) {
		super(label, collapsibleState);
	}

	// get tooltip(): string {
	// 	return `${this.label}-${this.version}`;
	// }

	get description(): string {
		return this.version;
	}

	iconPath = {
		// light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		// dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};
}