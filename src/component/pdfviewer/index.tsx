import React from 'react';
import {
  DocumentLoadEvent,
  LoadError,
  RenderPage,
  RenderPageProps,
  Viewer,
  classNames,
  TextDirection,
  ThemeContext,
} from '@react-pdf-viewer/core';
import { defaultLayoutPlugin, ToolbarProps, ToolbarSlot } from '@react-pdf-viewer/default-layout';
import { MoreActionsPopover } from '@react-pdf-viewer/toolbar';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

// @ts-ignore
import zh_CN from '@react-pdf-viewer/locales/lib/zh_CN.json';

export interface PermissionProps {
  copy: boolean;
  print: boolean;
  download: boolean;
}

export interface PdfViewerProps {
  watermark?: string;
  url: string;
  permission: PermissionProps;
}

const PdfViewer = ({url, permission, watermark } : PdfViewerProps) => {
  const { direction } = React.useContext(ThemeContext);
  const isRtl = direction === TextDirection.RightToLeft;

  const renderToolbar = (Toolbar: (props: ToolbarProps) => React.ReactElement) => {
    return <>
      <Toolbar>
        {(props: ToolbarSlot) => {
          const {
            CurrentPageInput,
            Download,
            EnterFullScreen,
            GoToNextPage,
            GoToPreviousPage,
            NumberOfPages,
            Print,
            ShowSearchPopover,
            SwitchTheme,
            Zoom,
            ZoomIn,
            ZoomOut,
          } = props;

          return (
            <div
              data-testid='toolbar'
              className={classNames({
                'rpv-toolbar': true,
                'rpv-toolbar--rtl': isRtl,
              })}
              role='toolbar'
              aria-orientation='horizontal'
            >
              <div className='rpv-toolbar__left'>
                <div className='rpv-toolbar__item'>
                  <ShowSearchPopover />
                </div>
                <div className='rpv-core__display--hidden rpv-core__display--block-small'>
                  <div className='rpv-toolbar__item'>
                    <GoToPreviousPage />
                  </div>
                </div>
                <div className='rpv-toolbar__item'>
                  <CurrentPageInput />
                  <span className='rpv-toolbar__label'>
                            <NumberOfPages />
                        </span>
                </div>
                <div className='rpv-core__display--hidden rpv-core__display--block-small'>
                  <div className='rpv-toolbar__item'>
                    <GoToNextPage />
                  </div>
                </div>
              </div>
              <div className='rpv-toolbar__center'>
                <div className='rpv-toolbar__item'>
                  <ZoomOut />
                </div>
                <div className='rpv-core__display--hidden rpv-core__display--block-small'>
                  <div className='rpv-toolbar__item'>
                    <Zoom />
                  </div>
                </div>
                <div className='rpv-toolbar__item'>
                  <ZoomIn />
                </div>
              </div>
              <div className='rpv-toolbar__right'>
                <div className='rpv-core__display--hidden rpv-core__display--block-medium'>
                  <div className='rpv-toolbar__item'>
                    <SwitchTheme />
                  </div>
                </div>
                <div className='rpv-core__display--hidden rpv-core__display--block-medium'>
                  <div className='rpv-toolbar__item'>
                    <EnterFullScreen />
                  </div>
                </div>
                {
                  permission.download && <div className='rpv-core__display--hidden rpv-core__display--block-medium'>
                    <div className='rpv-toolbar__item'>
                      <Download />
                    </div>
                  </div>
                }
                {
                  permission.print && <div className='rpv-core__display--hidden rpv-core__display--block-medium'>
                    <div className='rpv-toolbar__item'>
                      <Print />
                    </div>
                  </div>
                }
                <div className='rpv-toolbar__item'>
                  <MoreActionsPopover toolbarSlot={props} />
                </div>
              </div>
            </div>
          );
        }}
      </Toolbar>

    </>;
  };

  const renderError = (error: LoadError) => {
    let message = '';
    switch (error.name) {
      case 'InvalidPDFException':
        message = '文档无效或已损坏';
        break;
      case 'MissingPDFException':
        message = '文档不存在';
        break;
      case 'UnexpectedResponseException':
        message = '服务异常';
        break;
      default:
        message = '文档加载失败';
        break;
    }

    return (
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: '#e53e3e',
            borderRadius: '0.25rem',
            color: '#fff',
            padding: '0.5rem',
          }}
        >
          {message}
        </div>
      </div>
    );
  };

  const renderPage: RenderPage = (props: RenderPageProps) => (
    <>
      {props.canvasLayer.children}
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          left: 0,
          position: 'absolute',
          top: 0,
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'rgba(0, 0, 0, 0.2)',
            fontSize: `${8 * props.scale}rem`,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            transform: 'rotate(-45deg)',
          }}
        >
          {watermark}
        </div>
      </div>
      <div style={{ userSelect: permission.copy ? 'initial' : 'none' }}>
        {props.textLayer.children}
      </div>
      {props.annotationLayer.children}
    </>
  );

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar,
  });
  const handleDocumentLoad = (e: DocumentLoadEvent) => {
    const { activateTab } = defaultLayoutPluginInstance;

    // Activate the bookmark tab
    // activateTab(1);
  };

  return (
    <div
      style={{
        height: '100%',
      }}
    >
      <Viewer
        renderError={renderError}
        localization={zh_CN}
        renderPage={renderPage}
        fileUrl={url}
        plugins={[defaultLayoutPluginInstance]}
        onDocumentLoad={handleDocumentLoad}
      />
    </div>
  );
}

export default PdfViewer;
