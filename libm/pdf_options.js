/**
 * Defines marked-renderer-pdf style options.
 *
 *
 */
const PDF = require("pdfjs");


const Fonts = Object.freeze({
  serif: Object.freeze({
    regular: require("pdfjs/font/Times-Roman"),
    bold: require("pdfjs/font/Times-Bold"),
    italic: require("pdfjs/font/Times-Italic"),
    boldItalic: require("pdfjs/font/Times-BoldItalic"),
  }),
  sansSerif: Object.freeze({
    regular: require("pdfjs/font/Helvetica"),
    bold: require("pdfjs/font/Helvetica-Bold"),
    italic: require("pdfjs/font/Helvetica-Oblique"),
    boldItalic: require("pdfjs/font/Helvetica-BoldOblique"),
  }),
  monospace: Object.freeze({
    regular: require("pdfjs/font/Courier"),
    bold: require("pdfjs/font/Courier-Bold"),
    italic: require("pdfjs/font/Courier-Oblique"),
    boldItalic: require("pdfjs/font/Courier-BoldOblique"),
  }),
  symbol: require("pdfjs/font/ZapfDingbats"),
});


module.exports = {

  // marked options
  smartyPants: true,

  // pdf styling
  pdf: {
    style: {
      // pdfjs document - padding, margins, border
      // see https://github.com/cepharum/marked-renderer-pdf/blob/master/lib/util/box.js
      document: {
        padding: 2 * PDF.cm,
      },

      // pdf generator options
      // see https://github.com/cepharum/marked-renderer-pdf/blob/master/theme/index.js

      text: {
        fontFamily: {
          proportional: Fonts.sansSerif,
          monospace: Fonts.monospace,
        },
        fontSize: 11,
        lineHeight: 1.2,
        color: "#000000",
      },
      ruler: {
        width: 0.1,
        color: "black",
        indent: 2 * PDF.cm,
        paddingTop: 0,
        paddingBottom: 0.3 * PDF.cm,
      },
      paragraph: {
        marginTop: (index, num) => (index < num - 1 ? 0.3 * PDF.cm : 0),
      },
      code: {
        marginTop: (index, num) => (index < num - 1 ? 0.3 * PDF.cm : 0),
      },
      blockquote: {
        marginTop: (index, num) => (index < num - 1 ? 0.3 * PDF.cm : 0),
        paddingLeft: PDF.cm,
      },
      list: {
        item: {
          indent: 0.8 * PDF.cm,
          bulletPadding: 0.2 * PDF.cm,
          bulletAlign: "right",
          bulletFont: Fonts.sansSerif.regular,
          bullet: (ordered, level) => "\u2022\u25e6\u2013"[Math.min(2, level)],
          index: (ordered, level, index) => (level > 1 ? "%d)" : level > 0 ? "abcdefghijklmnopqrstuvwxyz"[index - 1] + "." : "%d."),
        },
        paddingBottom: (level, index, numItems) => (level > 0 ? 0 : index === numItems - 1 ? 0.3 * PDF.cm : 0),
      },
      table: {
        cellPadding: 5,
        borderHorizontalWidths: () => i => (i < 2 ? 1 : 0.1),
        borderHorizontalColors: () => () => "#000000",
        borderVerticalWidths: numColumns => Array(numColumns + 1).fill(0.5),
        borderVerticalColors: numColumns => [...Array(numColumns + 1)].map((_, i) => (i % 2 ? "#ff0000" : "#0000ff")),
        fontHeader: Fonts.sansSerif.bold,
        padding: {
          top: 0,
          bottom: (cols, hRows, bRows, index, num) => (index < num - 1 ? 0.3 * PDF.cm : 0),
        },
      },
      heading: {
        fontFamily: Fonts.sansSerif,
        fontSize: level => [24, 18, 16, 14, 14, 14][Math.min(5, level - 1)],
        bold: level => [true, true, true, true, false, false][Math.min(5, level - 1)],
        italic: false,
        lineHeight: 1.3,
        color: level => ["#000080", "#000000"][Math.min(5, level - 1)],
        padding: {
          top: level => [48, 32, 20][Math.min(2, level - 1)],
          bottom: level => [20, 12, 8, 6][Math.min(3, level - 1)],
        },
        align: level => ["center", "left"][Math.min(5, level-1)],
      },
    },
  },

};
