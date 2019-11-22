const marked = require('marked');
const PdfParser = require('../lib/pdfParser');
const fs = require('fs');

let md = fs.readFileSync('test/simple.md', 'utf8');

let options = marked.defaults || {};
fs.writeFileSync('test/options.json', JSON.stringify(options,null,"  "), 'utf8');

const tokens = marked.lexer( md );
fs.writeFileSync('test/tokens.json', JSON.stringify(tokens,null,"  "), 'utf8');
fs.writeFileSync('test/links.json', JSON.stringify(tokens.links, null, "  "), 'utf8');
console.log(tokens.length);

//const html = marked.Parser.parse( tokens );
//fs.writeFileSync('test/parsed.html', html, 'utf8');

const docdef = PdfParser.parse( tokens );
fs.writeFileSync('test/parsed.json', JSON.stringify(docdef,null,"  "), 'utf8');

console.log(tokens.length);
