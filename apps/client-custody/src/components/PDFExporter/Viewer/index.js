import { Document, PDFViewer } from '@react-pdf/renderer';

import ExportPage from '../ExportPage';

const PDF = ({ children, options }) => (
  <Document>
    <ExportPage options={options}>{children}</ExportPage>
  </Document>
);

const Viewer = ({ options, children }) => (
  <PDFViewer style={{ width: '100%', height: '50rem' }}>
    <PDF children={children} options={options} />
  </PDFViewer>
);

export default Viewer;
