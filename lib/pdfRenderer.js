/**
 * PdfRenderer
 */
"use strict";

const marked = require('marked');

let config = {
  styles: {
    separator: {
      lineWidth: 2,
      margin: 2
    }
  }
}


function PdfRenderer(options) {
  this.options = options || marked.defaults;
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

////// block level renderer methods

PdfRenderer.prototype.paragraph = function (text) {
  // text will be a single string or a string with a comma separated list of quoted strings and/or docdef text objects
  text = textToText(text);
  return { text: text };
}

PdfRenderer.prototype.heading = function (text, level, raw, slugger) {
  text = textToText(text);

  /*
  if (this.options.headerIds) {
    return '<h'
      + level
      + ' id="'
      + this.options.headerPrefix
      + slugger.slug(raw)
      + '">'
      + text
      + '</h'
      + level
      + '>\n';
  }
  */
  // else ignore IDs
  return { text: text, style: 'header' + level };
}

PdfRenderer.prototype.hr = function () {
  return {
    table: { body: [[{ stack: [] }]], widths: ["*"] },
    layout: "separator",
    borders: [0, config.styles.separator.lineWidth, 0, 0],
    margin: config.styles.separator.margin
  }
}

PdfRenderer.prototype.list = function (body, ordered, start) {
  var type = ordered ? 'ol' : 'ul',
    startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
  return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
}

PdfRenderer.prototype.listitem = function (text) {
  return '<li>' + text + '</li>\n';
}

PdfRenderer.prototype.checkbox = function (checked) {
  return '<input '
    + (checked ? 'checked="" ' : '')
    + 'disabled="" type="checkbox"'
    + (this.options.xhtml ? ' /' : '')
    + '> ';
}

PdfRenderer.prototype.blockquote = function (quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

PdfRenderer.prototype.code = function (code, infostring, escaped) {
  var lang = (infostring || '').match(/\S*/)[0];
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '</code></pre>\n';
};

PdfRenderer.prototype.html = function (html) {
  return { text: html, style: "html" };
};

PdfRenderer.prototype.table = function (header, body) {
  if (body) body = '<tbody>' + body + '</tbody>';

  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + body
    + '</table>\n';
};

PdfRenderer.prototype.tablerow = function (content) {
  return '<tr>\n' + content + '</tr>\n';
};

PdfRenderer.prototype.tablecell = function (content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' align="' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};


////// inline level renderer methods
// inlineLexer is string based and a little hard to extend

PdfRenderer.prototype.text = function (text) {
  let a = text.match(/[^\r\n]+/g);
  let o = '';
  a.forEach(element => {
    o += '"' + element + '",';
  });
  return o;
};

PdfRenderer.prototype.strong = function (text) {
  text = textToText(text);
  return JSON.stringify({ text: text, bold: true}) + ',';
};

PdfRenderer.prototype.em = function (text) {
  return JSON.stringify({ text: text, italics: true}) + ',';
};

PdfRenderer.prototype.codespan = function (text) {
  return JSON.stringify({ text: text, style: "code" }) + ',';
};

PdfRenderer.prototype.br = function () {
  return JSON.stringify(' ') + ',';
};

PdfRenderer.prototype.del = function (text) {
  return JSON.stringify({ text: text, decoration: "lineThrough" }) + ',';
};

PdfRenderer.prototype.link = function (href, title, text) {
  //href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
  if (href === null) {
    return JSON.stringify({ text: text }) + ',';
  }
  return JSON.stringify({ text: title, link: href, decoration: "underline" }) + ',';
};

PdfRenderer.prototype.image = function (href, title, text) {
  //href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
  if (href === null) {
    return JSON.stringify({ text: text }) + ',';
  }

  return JSON.stringify({ image: href }) + ',';
};

module.exports = PdfRenderer;
