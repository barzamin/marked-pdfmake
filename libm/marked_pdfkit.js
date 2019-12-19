const marked = require('marked');
const PDFDocument = require('pdfkit');

/**
 * Parses an input String with the help of the "marked"-package and writes the corresponding elements to the supplied document
 * @param doc - the PDFDocument to write to
 * @param input - the input String
 * @returns {object} - the document for chaining
 */
export default function (doc, input) {

  // Array of markdown parts as objects
  var markdown = marked.lexer(input);

  // loop through the Array, going over each markdown-part individually
  markdown.forEach(function (part, index) {

    if (part.type === 'paragraph') {
      doc.font('Normal').fontSize(8).text(part.text, { lineGap: 1.3 }).moveDown();
    } 
    else if (part.type === 'heading') {
      var fontsize = 8;
      // depth defines if it's a h1, h2, h3 etc.
      switch (part.depth) {
        case 1: fontsize = 12; break;
        case 2: fontsize = 10; break;
        default: fontsize = 8;
      }
      doc.fontSize(4).moveDown().font('Heading2').fontSize(fontsize).text(part.text).fontSize(8).moveDown();
    } 
    else if (part.type === 'text' && markdown[index - 1].type === 'list_item_start') {
      doc.font('Normal').fontSize(8).list([part.text], { lineGap: 1.3 });
    } 
    else if (part.type === 'list_end') {
      doc.fontSize(8).moveDown();
    }
  });

  return doc;
}
