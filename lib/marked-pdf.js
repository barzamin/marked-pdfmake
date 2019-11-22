// marked-pdf.js - Convert markdown to PDF
// Copyright (C) 2018 Drew O. Letcher
// License: MIT

const marked = require('marked');
const PdfParser = require('./pdfParser');
const PdfMake = require('pdfmake');


function marked_pdf(md, options) {
  return new Promise( (resolve,reject) => {

    try {
      let tokens = marked.Lexer.lex(md, options);
      let docDefinition = PdfParser.parse(tokens, options.pdfParser);

      // Define font files
      let fonts = {
        Roboto: {
          normal: 'fonts/Roboto-Regular.ttf',
          bold: 'fonts/Roboto-Medium.ttf',
          italics: 'fonts/Roboto-Italic.ttf',
          bolditalics: 'fonts/Roboto-MediumItalic.ttf'
        }
      };
      let printer = new PdfMake(fonts);

      let pdfOptions = Object.assign( {}, options.pdfMake, {
        // ...
      });

      let pdfDoc = printer.createPdfKitDocument(docDefinition, pdfOptions);
      resolve(pdfDoc);
    }
    catch (err) {
      reject(error);
    }
  })

};

module.exports = marked_pdf;
module.exports.PdfParser = PdfParser;
