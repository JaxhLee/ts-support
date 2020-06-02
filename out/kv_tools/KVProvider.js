"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KvProvider = void 0;
const vscode = require("vscode");
const request = require("request");
class KvProvider {
    constructor(context) {
        this.list = null;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        // this.request()
    }
    refresh(kvNode) {
        if (kvNode) {
            this._onDidChangeTreeData.fire(kvNode);
        }
        else {
            this._onDidChangeTreeData.fire(null);
        }
    }
    request() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                const url = "http://localhost/index.php";
                const req = request.post(url + '?action=list&mod=kv_ctx', {
                    body: JSON.stringify({
                        steamid: "1",
                    })
                }, ((error, response, body) => {
                    if (response.statusCode == 200) {
                        const data = JSON.parse(body);
                        console.log('Hello');
                        console.log(data);
                        this.list = {};
                        for (const addonname in data) {
                            const v = data[addonname];
                            this.list[addonname] = {
                                files: v.files,
                                js_path: v._index.file_path
                            };
                        }
                        console.log(this.list);
                        resolve(1);
                    }
                    console.log(333);
                }).bind(this));
            });
        });
    }
    getFiles(addonname) {
        const res = [];
        if (this.list && this.list[addonname]) {
            const js_path = this.list[addonname].js_path;
            const files = this.list[addonname].files;
            for (const k in files) {
                const file_path = files[k];
                res.push({ type: "file", file_path: file_path, js_path: js_path });
            }
        }
        return res;
    }
    getAddons() {
        const res = [];
        for (const addonname in this.list) {
            res.push({ type: "addon", file_path: addonname, js_path: "" });
        }
        return res;
    }
    getTreeItem(element) {
        console.log(222);
        let treeItem = new vscode.TreeItem(element.file_path, element.type == "addon" ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        if (element.type == "addon") {
            let files = this.getFiles(element.file_path);
            // files = Promise.resolve(files)
            console.log("files");
            console.log(files);
            treeItem.command = {
                command: 'tss.kvTools.downloadall',
                title: 'downloadall333',
                arguments: [1, 2, 3]
            };
        }
        else if (element.type == "file") {
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
    getChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(333);
            if (element) {
                if (element.type == "addon") {
                    const files = this.getFiles(element.file_path);
                    return Promise.resolve(files);
                }
                return Promise.resolve([element]);
            }
            else {
                yield this.request();
                console.log('9999');
                const addons = this.getAddons();
                return Promise.resolve(addons);
            }
        });
    }
}
exports.KvProvider = KvProvider;
class kvpath extends vscode.TreeItem {
    constructor(label, version, collapsibleState) {
        super(label, collapsibleState);
        this.label = label;
        this.version = version;
        this.collapsibleState = collapsibleState;
        this.iconPath = {
        // light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
        // dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
        };
    }
    // get tooltip(): string {
    // 	return `${this.label}-${this.version}`;
    // }
    get description() {
        return this.version;
    }
}
//# sourceMappingURL=KVProvider.js.map