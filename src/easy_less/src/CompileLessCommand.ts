
import * as vscode from 'vscode';
import * as less from 'less';
import * as path from 'path';
import * as fs from 'fs';
import * as extend from 'extend';

import Configuration = require("./Configuration");
import LessCompiler = require("./LessCompiler");
import StatusBarMessage = require("./StatusBarMessage");
import StatusBarMessageTypes = require("./StatusBarMessageTypes");

const RANGE_EOL = 4096;

class CompileLessCommand {
    public constructor(
        private document: vscode.TextDocument,
        private lessDiagnosticCollection: vscode.DiagnosticCollection, private onSave: boolean) {
    }

    public async execute() {
        const globalOptions: Configuration.EasyLessOptions = Configuration.getGlobalOptions(this.document);
        if (!globalOptions.watchFile && this.onSave) {
            const fileName = path.basename(this.document.fileName);
            StatusBarMessage.show('文件未编译 --> ' + fileName, StatusBarMessageTypes.INDEFINITE);
            return;
        }

        StatusBarMessage.hideError();

        const compilingMessage = StatusBarMessage.show("$(zap) TSS: Compiling less --> css", StatusBarMessageTypes.INDEFINITE);
        const startTime: number = Date.now();
        try {
            await LessCompiler.compile(this.document.fileName, this.document.getText(), globalOptions);
            const elapsedTime: number = (Date.now() - startTime);
            compilingMessage.dispose();
            this.lessDiagnosticCollection.set(this.document.uri, []);

            StatusBarMessage.show(`$(check) TSS: Less compiled in ${elapsedTime}ms`, StatusBarMessageTypes.SUCCESS);
        }
        catch (error) {
            compilingMessage.dispose();

            let { message, range } = this.getErrorMessageAndRange(error);
            let affectedUri = this.getErrorAffectedUri(error);

            if (affectedUri === undefined || range === undefined) {
                affectedUri = this.document.uri;
                range = new vscode.Range(0, 0, 0, 0);
            }

            const diagnosis = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
            this.lessDiagnosticCollection.set(affectedUri, [diagnosis]);

            StatusBarMessage.show("$(alert) TSS: Error compiling less (more detail in Problems)", StatusBarMessageTypes.ERROR);
        }
    }

    private getErrorAffectedUri(error: any): vscode.Uri | undefined {
        let affectedUri: vscode.Uri | undefined;

        if (error.filename) {
            affectedUri = vscode.Uri.file(error.filename);
            const isCurrentDocument = !error.filename.includes("/")
                && !error.filename.includes("\\")
                && error.filename === path.basename(this.document.fileName);

            if (isCurrentDocument) {
                affectedUri = this.document.uri;
            }
        }

        return affectedUri;
    }

    private getErrorMessageAndRange(error: any): { message: string, range: vscode.Range | undefined } {
        if (error.code) {
            // fs errors
            const fileSystemError = <any>error;
            switch (fileSystemError.code) {
                case 'EACCES':
                case 'ENOENT':
                    return {
                        message: `Cannot open file '${fileSystemError.path}'`,
                        range: new vscode.Range(0, 0, 0, RANGE_EOL),
                    };
            }
        }
        else if (error.line !== undefined && error.column !== undefined) {
            // less errors: try to highlight the affected range
            const lineIndex: number = error.line - 1;
            return {
                message: error.message,
                range: new vscode.Range(lineIndex, error.column, lineIndex, RANGE_EOL),
            };
        }

        return {
            message: error.message,
            range: new vscode.Range(0, 0, 0, RANGE_EOL),
        };
    }
}


export = CompileLessCommand;