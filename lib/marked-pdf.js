// marked-pdfmake.js - Convert markdown to PDF
// Copyright (C) 2018 Drew O. Letcher
// License: MIT

const marked = require('marked');
const PdfParser = require('./pdfParser');
const PdfMake = require('pdfmake');
const { defaults } = require('./defaults');


function markedPdf(md, options) {
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
      let pdfMake = new PdfMake(fonts);

      let pdfOptions = Object.assign( {
          tableLayouts: defaults.defaultTableLayouts
        },
        options.pdfMake );

      let pdfDoc = pdfMake.createPdfKitDocument(docDefinition, pdfOptions);
      resolve(pdfDoc);
    }
    catch (err) {
      reject(error);
    }
  })

};

module.exports = markedPdf;
module.exports.PdfParser = PdfParser;
