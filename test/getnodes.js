const fs = require('fs');
const marked = require('marked');

let md = fs.readFileSync('test/example.md', 'utf8');

let options = marked.defaults || {};
fs.writeFileSync('test/options.json', JSON.stringify(options,null,"  "), 'utf8');

const tokens = marked.lexer( md );
fs.writeFileSync('test/tokens.json', JSON.stringify(tokens,null,"  "), 'utf8');
console.log(tokens.length);

const parsed = marked.Parser.parse( tokens );
fs.writeFileSync('test/parsed.html', parsed, 'utf8');

console.log(tokens.length);
