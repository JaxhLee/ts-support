
import * as vscode from 'vscode';
import * as path from 'path';
import * as less from 'less';
import * as extend from 'extend';

export function getGlobalOptions(document: vscode.TextDocument): EasyLessOptions {
    const lessFilenamePath: path.ParsedPath = path.parse(document.fileName);
    const defaultOptions: EasyLessOptions = {
        plugins: [],
        rootFileInfo: getRootFileInfo(lessFilenamePath),
        relativeUrls: false
    };

    const configuredOptions = vscode.workspace.getConfiguration("tss-less", document.uri).get<EasyLessOptions>("compile");
    return extend({}, defaultOptions, configuredOptions || {});
}

export function getRootFileInfo(parsedPath: path.ParsedPath): any {
    parsedPath.ext = ".less";
    parsedPath.base = parsedPath.name + ".less";

    return {
        filename: parsedPath.base,
        currentDirectory: parsedPath.dir,
        relativeUrls: false,
        entryPath: parsedPath.dir + "/",
        rootpath: null,
        rootFilename: null
    }
}

export interface EasyLessOptions extends Less.Options {
    watchFile?: boolean;
    main?: string | string[];
    out?: string | boolean;
    outExt?: string;
    sourceMap?: any;
    relativeUrls?: boolean;
    sourceMapFileInline?: boolean;
    autoprefixer?: string | string[];
    javascriptEnabled?: boolean;
    rootFileInfo?: any
    // sourceMapURL?: string;
    // sourceMapBasepath?: string;
    // sourceMapRootpath?: string;
    // outputSourceFiles?: boolean;
    // sourceMapFilename?: string;
}