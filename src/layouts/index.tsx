import React from 'react';
import { Worker } from '@react-pdf-viewer/core';

const BasicLayout: React.FC = props => {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
      {props.children}
    </Worker>
  );
};

export default BasicLayout;
