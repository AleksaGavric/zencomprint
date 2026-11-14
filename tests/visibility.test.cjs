const {test} = require('node:test');
const assert = require('node:assert/strict');
const {hiddenLineNumbers: hidden} = require('../out/visibility');
test('standalone output and full-line comments', () => {
  assert.deepEqual(hidden(['// explanation','console.log("ok");','const x = 1;'], 'typescript'), [0,1]);
  assert.deepEqual(hidden(['# explanation','print("ok")'], 'python'), [0,1]);
});
test('strings, URLs and mixed code remain visible', () => {
  assert.deepEqual(hidden(['const url = "https://example.com";', 'const s = "console.log(x)";', 'console.log(x); mutate();', 'if (ready) console.log(x);'], 'javascript'), []);
  assert.deepEqual(hidden(['value = "# not a comment"','print("x"); mutate()'], 'python'), []);
});
test('nested calls and parentheses inside quoted output', () => {
  assert.deepEqual(hidden(['console.log(foo("("));', 'console.log("a) b");'], 'typescript'), [0,1]);
});
test('multiline string content remains visible', () => {
  assert.deepEqual(hidden(['const text = `', '// not a comment', 'console.log("text")', '`;', '// actual comment'], 'javascript'), [4]);
  assert.deepEqual(hidden(['text = """', '# not a comment', 'print("text")', '"""', '# actual comment'], 'python'), [4]);
});
test('unterminated PHP block comments never walk beyond EOF', () => {
  assert.deepEqual(hidden(['/* no terminator'], 'php'), []);
  assert.deepEqual(hidden(['/**',' * unfinished'], 'php'), []);
});
test('unsupported languages and output-like identifiers remain visible', () => {
  assert.deepEqual(hidden(['// text','console.log(x)'], 'plaintext'), []);
  assert.deepEqual(hidden(['echoes = 1;', 'sprint(x);', 'var_dumped(x);'], 'php'), []);
});
