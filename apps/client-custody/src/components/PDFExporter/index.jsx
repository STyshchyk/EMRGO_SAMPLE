import { forwardRef, useImperativeHandle } from "react";

import { Document, Font, pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

import ExportPage from "./ExportPage";

export const chunkSubstr = (str, size) => {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }

  return chunks;
};

Font.registerHyphenationCallback((word) => {
  if (word.length >= 7) {
    return chunkSubstr(word, 3);
  } else {
    return [word];
  }
});
// changed

Font.register({
  family: "D-DIN Exp",
  fonts: [
    { src: "https://d1l2ge0agmsvzm.cloudfront.net/assets/fonts/D-DINExp.woff" }, // font-style: normal, font-weight: normal
    {
      src: "https://d1l2ge0agmsvzm.cloudfront.net/assets/fonts/D-DINExp-Italic.woff",
      fontStyle: "italic",
    },
    {
      src: "https://d1l2ge0agmsvzm.cloudfront.net/assets/fonts/D-DINExp-Bold.woff",
      fontWeight: 700,
    },
  ],
});

// Font.register({
//   family: 'D-DIN',
//   fonts: [
//     { src: 'https://d1l2ge0agmsvzm.cloudfront.net/assets/fonts/D-DIN.woff' }, // font-style: normal, font-weight: normal
//     { src: 'https://d1l2ge0agmsvzm.cloudfront.net/assets/fonts/D-DIN-Italic.woff', fontStyle: 'italic' },
//     { src: 'https://d1l2ge0agmsvzm.cloudfront.net/assets/fonts/D-DIN-Bold.woff', fontWeight: 700 },
//   ],
// });

Font.register({
  family: "NotoSansArabic",
  fonts: [
    { src: "/fonts/NotoSansArabic/NotoSansArabic-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/NotoSansArabic/NotoSansArabic-Medium.ttf", fontWeight: 500 },
    { src: "/fonts/NotoSansArabic/NotoSansArabic-Bold.ttf", fontWeight: 700 },
  ],
});

// Font.register({
//   family: 'NotoSansArabicUI',
//   fonts: [
//     { src: '/fonts/NotoSansArabic/NotoSansArabicUI-Regular.ttf', fontWeight: 400  },
//     { src: '/fonts/NotoSansArabic/NotoSansArabicUI-Medium.ttf', fontWeight: 500 },
//     { src: '/fonts/NotoSansArabic/NotoSansArabicUI-Bold.ttf', fontWeight: 700 },
//   ],
// });

// Font.register({
//   family: 'Mirza',
//   fonts: [
//     { src: '/fonts/Mirza/Mirza-Regular.ttf', fontWeight: 400 },
//     { src: '/fonts/Mirza/Mirza-Medium.ttf', fontWeight: 500 },
//     { src: '/fonts/Mirza/Mirza-SemiBold.ttf', fontWeight: 600 },
//     { src: '/fonts/Mirza/Mirza-Bole.ttf', fontWeight: 700 },
//   ],
// });

const PDF = ({ children, options }) => (
  <Document>
    <ExportPage options={options}>{children}</ExportPage>
  </Document>
);

const PDFExporter = forwardRef(({ title, options, children }, ref) => {
  useImperativeHandle(ref, () => ({
    async exportFile() {
      const doc = <PDF children={children} options={options} />;
      const asPdf = pdf([]); // {} is important, throws without an argument
      asPdf.updateContainer(doc);
      const blob = await asPdf.toBlob();
      saveAs(blob, `${title}.pdf`);
    },
  }));

  return <></>;
});

export default PDFExporter;
