// marked-pdfmake.js - Convert markdown to PDF
// Copyright (C) 2018 Drew O. Letcher
// License: MIT

const PdfMake = require('pdfmake');
const fs = require('fs');

async function main() {

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

  let docDefinition = fs.readFileSync('./test/parsed.json');

  let pdfOptions =  {
    // ...
  };

  let pdfDoc = printer.createPdfKitDocument(docDefinition, pdfOptions);

  await pdfDoc.pipe(fs.createWriteStream('./test/output.pdf','utf8'));
  await pdfDoc.end();

  console.log('done');
}

main();
