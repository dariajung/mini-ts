/// <reference path="../../typings/mocha/mocha.d.ts"/>
/// <reference path="../../typings/chai/chai.d.ts"/>

import {Transpiler} from '../../src/main';
import * as ts from 'typescript';
import * as assert from 'assert';
import * as chai from 'chai';

// export function expectTranslate(tsCode: Input) {
//   var result = translateSource(tsCode);
//   return chai.expect(result);
// }

export function translateSource(contents: string): string {
  var transpiler = new Transpiler();
  var options: ts.CompilerOptions = { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS };
  var host = ts.createCompilerHost(options);
  var program = ts.createProgram(['test.ts'], options, host);
  var result = transpiler.translateProgram(program);
  return result['test.ts'];

}

describe('Equality statement', function() {
	it('shows that 1 equals 1', function() { assert.equal(1, 1); })
});

