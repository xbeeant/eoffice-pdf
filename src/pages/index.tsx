import React from 'react';
import PdfViewer, { PermissionProps } from '@/component/pdfviewer';

const permission : PermissionProps = {
  copy: true,
  print: true,
  download: true
};

export default function() {
  return (
    <div
      style={{
        height: '100%',
      }}
    >
      <PdfViewer
        url='./pdf-open-parameters.pdf'
        permission={permission}
        watermark="Water Mark"
      />
    </div>
  );
}
