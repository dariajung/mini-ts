/// <reference path='../node_modules/typescript/bin/typescript.d.ts' />

import * as ts from 'typescript';

const DEBUG = true;

export class Transpiler {
	private output: Output;
	private currentFile: ts.SourceFile;

  constructor() {}

  helloWorld() { return 'hello world'; }

  emit(s: string) {
  	this.output.emit(s);
  }

	translateProgram(program: ts.Program): {[path: string] : string} {
  	var paths: {[path: string] : string} = {};
	   program.getSourceFiles()
		      .filter((sourceFile: ts.SourceFile) =>
		                  (!sourceFile.fileName.match(/\.d\.ts$/) &&
		                   !!sourceFile.fileName.match(/\.[jt]s$/)))
		      .forEach((f) => paths[f.fileName] = this.translate(f));
    return paths;
  }

	translate(sourceFile: ts.SourceFile): string {
		this.output = new Output();
		if (DEBUG) this.getNodeKindInfo(sourceFile);
		ts.forEachChild(sourceFile, (node) => this.visit(node));
		return this.output.getResult();
	}

	transpile(fileNames: string[]) {
			var options: ts.CompilerOptions = { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS };
			var host = ts.createCompilerHost(options);
			var program = ts.createProgram(fileNames, options, host);
			var fileMap: {[s: string] : boolean} = {};

			fileNames.forEach((f) => fileMap[f] = true);

			program.getSourceFiles()
				.filter((sourceFile) => fileMap[sourceFile.fileName])
		   	// Do not generate output for .d.ts files.
	     .filter((sourceFile: ts.SourceFile) =>
	                !sourceFile.fileName.match(/\.d\.ts$/))
	     .forEach((f: ts.SourceFile) => {
	      var renamedCode = this.translate(f);
	    });
		}

	visit(node: ts.Node) {
		switch (node.kind) {
			case ts.SyntaxKind.ClassDeclaration:
				console.log('CLASS DECLARATION');
				var cd = <ts.ClassDeclaration>node;
				console.log(cd);
				break;
			default:
				console.log('Unsupported node type (' + node.kind + ') ' + (<any>ts).SyntaxKind[node.kind] + ': ' + node.getFullText());
				break;
		}
	}

  visitEach(nodes: ts.Node[]) { nodes.forEach((node) => this.visit(node)); }

  /* DEBUGGING PURPOSES ONLY */
	private getNodeKindInfo(sourceFile: ts.Node) {
    ts.forEachChild(sourceFile, (node) => {
      console.log((<any>ts).SyntaxKind[node.kind] + ': ' + node.kind);
      this.getNodeKindInfo(node);
	   });
  }

}

class Output {
	private result: string = '';

	emit(str: string) {
		this.result += ' ';
	   	this.result += str;
	}

	getResult(): string {
		return this.result;	
	}
}

var transpiler = new Transpiler();
transpiler.transpile([ '../../test/input/class_decl.ts' ]);
