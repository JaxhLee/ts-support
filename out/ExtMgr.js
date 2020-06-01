"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtMgr = void 0;
const vscode = require("vscode");
const rd = require("rd");
const CompileLessCommand = require("./easy_less/src/CompileLessCommand");
const easyless = require("./easy_less/src/easyLess");
const tss_1 = require("./core/tss");
const kv_1 = require("./kv_tools/kv");
let ExtMgr = /** @class */ (() => {
    class ExtMgr {
        static Install(context) {
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
            tss_1.TsSupport.Install(context);
            kv_1.kvtools.Install(context);
        }
        static Uninstall() {
            easyless.deactivate();
        }
    }
    ExtMgr.lessDiagnosticCollection = vscode.languages.createDiagnosticCollection();
    return ExtMgr;
})();
exports.ExtMgr = ExtMgr;
//# sourceMappingURL=ExtMgr.js.map