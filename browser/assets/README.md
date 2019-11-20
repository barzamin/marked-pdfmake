# marked-pdfjs-browser

A prepared build of [marked-pdfjs](https://www.npmjs.com/package/marked-pdfjs) for generating PDFs from markdown in browser.

This package is generated as part of CI/CD of [marked-pdfjs](https://www.npmjs.com/package/marked-pdfjs).

## License

MIT

## Installation 

```bash
npm install marked-pdfjs-browser
```

## Usage

When using WebPack the converter may be imported using

```javascript
import MarkdownToPDF from "marked-pdfjs-browser";
```

In addition the script may be injected using `<script>`-tag:

```html
<script type="text/javascript" src="/url/to/project/node_modules/marked-pdfjs-browser/main.js"></script>
```

This will expose the converter in global variable `MarkdownToPDF`.

In either case you may use the converter like this:

```javascript
MarkdownToPDF.convertString( yourMarkdownString )
  .then( function( pdf ) {
    // TODO: process your PDF, e.g. like this:
    domAElement.href = URL.createObjectURL( new Blob( [pdf], {
      type: "application/pdf",
    } ) );
  } );
```
