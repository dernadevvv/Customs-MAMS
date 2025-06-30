//หน้าข่าว
import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Home } from 'lucide-react';

const Documents: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'navigationState') {
        setCanGoBack(event.data.canGoBack);
        setCanGoForward(event.data.canGoForward);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleBack = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({ type: 'navigate', action: 'back' }, '*');
    }
  };

  const handleForward = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({ type: 'navigate', action: 'forward' }, '*');
    }
  };

  const handleHome = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({ 
        type: 'navigate', 
        action: 'home',
        url: 'https://moffit.mof.go.th/category/news/'
      }, '*');
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({ type: 'refresh' }, '*');
    }
  };

  const injectNavigationScript = () => {
    if (iframeRef.current?.contentWindow) {
      const script = `
        (function() {
          class IframeHistory {
            constructor() {
              this.stack = [];
              this.currentIndex = -1;
              this.baseUrl = 'https://moffit.mof.go.th/category/news/';
              
              // Initialize with current URL
              this.push(window.location.href);
              
              // Set up message handlers
              this.setupMessageHandlers();
              // Set up navigation monitoring
              this.setupNavigationMonitoring();
              // Set up click interception
              this.setupClickInterception();
            }

            push(url) {
              // Remove all entries after current index
              this.stack = this.stack.slice(0, this.currentIndex + 1);
              this.stack.push(url);
              this.currentIndex++;
              this.updateState();
            }

            setupMessageHandlers() {
              window.addEventListener('message', (event) => {
                const { type, action, url } = event.data;
                
                if (type === 'navigate') {
                  switch (action) {
                    case 'back':
                      if (this.canGoBack()) {
                        this.currentIndex--;
                        window.location.href = this.stack[this.currentIndex];
                      }
                      break;
                    case 'forward':
                      if (this.canGoForward()) {
                        this.currentIndex++;
                        window.location.href = this.stack[this.currentIndex];
                      }
                      break;
                    case 'home':
                      this.push(this.baseUrl);
                      window.location.href = this.baseUrl;
                      break;
                  }
                } else if (type === 'refresh') {
                  window.location.reload();
                }
              });
            }

            setupNavigationMonitoring() {
              // Monitor URL changes
              let lastUrl = window.location.href;
              setInterval(() => {
                const currentUrl = window.location.href;
                if (currentUrl !== lastUrl) {
                  this.push(currentUrl);
                  lastUrl = currentUrl;
                }
              }, 100);

              // Handle popstate events
              window.addEventListener('popstate', (event) => {
                const currentUrl = window.location.href;
                if (currentUrl !== this.stack[this.currentIndex]) {
                  this.push(currentUrl);
                }
              });
            }

            setupClickInterception() {
              document.addEventListener('click', (event) => {
                const link = event.target.closest('a');
                if (link && link.href) {
                  event.preventDefault();
                  this.push(link.href);
                  window.location.href = link.href;
                }
              }, true);
            }

            canGoBack() {
              return this.currentIndex > 0;
            }

            canGoForward() {
              return this.currentIndex < this.stack.length - 1;
            }

            updateState() {
              window.parent.postMessage({
                type: 'navigationState',
                canGoBack: this.canGoBack(),
                canGoForward: this.canGoForward()
              }, '*');
            }
          }

          // Initialize history management
          window._iframeHistory = new IframeHistory();
        })();
      `;

      iframeRef.current.contentWindow.postMessage({ type: 'injectScript', script }, '*');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">News</h2>
        <p className="mt-1 text-md text-gray-500 dark:text-gray-400">ข่าวสารประจำวัน</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={handleBack}
            disabled={!canGoBack}
            className={`p-2 rounded-full transition-colors ${
              canGoBack
                ? 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
            title="Go back"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleForward}
            disabled={!canGoForward}
            className={`p-2 rounded-full transition-colors ${
              canGoForward
                ? 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
            title="Go forward"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={handleHome}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Go to home"
          >
            <Home size={20} />
          </button>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Refresh page"
          >
            <RefreshCw size={20} />
          </button>
        </div>
        <iframe
          ref={iframeRef}
          src="https://moffit.mof.go.th/category/news/"
          className="w-full h-[calc(100vh-16rem)] border-0"
          title="MOF News"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          loading="lazy"
          onLoad={injectNavigationScript}
        />
      </div>
    </div>
  );
};

export default Documents;







// import React from 'react';

// const Documents: React.FC = () => {
//   return (
//     <div className="p-6">
//       <div className="mb-8">
//         <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Documents</h2>
//         <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Access and manage your files</p>
//       </div>

//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
//         <div className="text-center py-12">
//           <p className="text-gray-500 dark:text-gray-400">Documents component coming soon</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Documents;