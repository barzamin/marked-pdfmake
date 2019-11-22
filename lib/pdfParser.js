/**
 * Parsing & Compiling
 */
"use strict";

const marked = require('marked');
const PdfRenderer = require('./pdfRenderer');

const defaultDocDefinition = {
  content: [],
  styles: {}
}

function textToText(text) {
  if (typeof text !== 'string')
    return (text);

  if (text && text.endsWith(','))
    text = text.slice(0,text.length-1);

  if (text.indexOf(',') < 0)
    return JSON.parse(text);
  else
    return JSON.parse('[' + text + ']');
}


function PdfParser(options) {
  marked.defaults.renderer = new PdfRenderer();  // override default

  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
  this.slugger = new marked.Slugger();

  this.docdef = Object.assign({}, defaultDocDefinition);
}

/**
 * Static Parse Method
 */

PdfParser.parse = function (src, options) {
  var parser = new PdfParser(options);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

PdfParser.prototype.parse = function (src) {
  this.inline = new marked.InlineLexer(src.links, this.options);
  // use an InlineLexer with a TextRenderer to extract pure text
  this.inlineText = new marked.InlineLexer(
    src.links,
    merge({}, this.options, { renderer: new marked.TextRenderer() })
  );
  this.tokens = src.reverse();

  while (this.next()) {
    this.docdef.content.push(this.tok());
  }

  return this.docdef;
};

/**
 * Next Token
 */

PdfParser.prototype.next = function () {
  this.token = this.tokens.pop();
  return this.token;
};

/**
 * Preview Next Token
 */

PdfParser.prototype.peek = function () {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

PdfParser.prototype.parseText = function () {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  // lex, parse and render the inner text
  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

PdfParser.prototype.tok = function () {
  switch (this.token.type) {
    case 'space': {
      return " ";
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        unescape(this.inlineText.output(this.token.text)),
        this.slugger);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = '',
        body = '',
        i,
        row,
        cell,
        j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      body = '';
      var ordered = this.token.ordered,
        start = this.token.start;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered, start);
    }
    case 'list_item_start': {
      body = '';
      var loose = this.token.loose;
      var checked = this.token.checked;
      var task = this.token.task;

      if (this.token.task) {
        if (loose) {
          if (this.peek().type === 'text') {
            var nextToken = this.peek();
            nextToken.text = this.renderer.checkbox(checked) + ' ' + nextToken.text;
          } else {
            this.tokens.push({
              type: 'text',
              text: this.renderer.checkbox(checked)
            });
          }
        } else {
          body += this.renderer.checkbox(checked);
        }
      }

      while (this.next().type !== 'list_item_end') {
        body += !loose && this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }
      return this.renderer.listitem(body, task, checked);
    }
    case 'html': {
      // TODO parse inline content if parameter markdown=1
      return this.renderer.html(this.token.text);
    }
    case 'paragraph': {
      let text = this.inline.output(this.token.text);
      text = textToText(text);
      return this.renderer.paragraph(text);
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
    default: {
      var errMsg = 'Token with "' + this.token.type + '" type was not found.';
      if (this.options.silent) {
        console.log(errMsg);
      } else {
        throw new Error(errMsg);
      }
    }
  }
};

function merge(obj) {
  var i = 1,
      target,
      key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}

module.exports = PdfParser;
