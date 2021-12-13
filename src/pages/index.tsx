import { useEffect, useState } from 'react';
import { request } from 'umi';
import { Skeleton } from 'antd';
import type { PermissionProps } from '@/component/pdfviewer';
import PdfViewer from '@/component/pdfviewer';

const permission: PermissionProps = {
  copy: true,
  print: true,
  download: true,
};

interface LocationProps extends Location {
  query: { rid: string, aid: string };
}

interface Data {
  url: string;
}

const Index: ({ location }: { location: LocationProps }) => JSX.Element = ({ location }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Data>({url: ''});

  const loadData = async () => {
    setLoading(true);
    const response = await request('/api/resource/detail', {
      params: {
        rid: location.query.rid,
      },
    });
    if (response.success) {
      setData(response.data);
    }
  };

  useEffect(() => {
    loadData().then(() => setLoading(false));
  }, [location.query.aid]);

  return (
    <div>
      {loading && <Skeleton />}
      {!loading &&
        <div
          style={{
            height: '100%',
          }}
        >
          <PdfViewer
            url={data.url}
            permission={permission}
            watermark='Water Mark'
          />
        </div>
      }
    </div>
  );
};

export default Index;
