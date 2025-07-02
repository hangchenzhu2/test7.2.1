import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

function Error({ statusCode, hasGetInitialPropsRun, err }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // 尝试从URL路径中检测语言
    const path = window.location.pathname;
    const langMatch = path.match(/^\/([a-z]{2})\//);
    if (langMatch) {
      setCurrentLanguage(langMatch[1]);
    }
  }, []);

  const isZh = currentLanguage === 'zh';

  // 根据状态码显示不同的错误信息
  const getErrorMessage = () => {
    if (statusCode === 404) {
      return isZh ? '页面未找到' : 'Page Not Found';
    } else if (statusCode === 500) {
      return isZh ? '服务器内部错误' : 'Internal Server Error';
    } else {
      return isZh ? '发生了一个错误' : 'An error occurred';
    }
  };

  const getErrorDescription = () => {
    if (statusCode === 404) {
      return isZh 
        ? '抱歉，您访问的页面不存在或已被移动。'
        : 'Sorry, the page you are looking for does not exist or has been moved.';
    } else if (statusCode === 500) {
      return isZh
        ? '服务器遇到了一些问题，我们正在努力修复。'
        : 'The server encountered an issue. We are working to fix it.';
    } else {
      return isZh
        ? '请刷新页面重试，或联系我们获取帮助。'
        : 'Please refresh the page and try again, or contact us for help.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-blue-500 to-teal-400 flex items-center justify-center px-4">
      <Head>
        <title>{`${statusCode} - ${getErrorMessage()} | van Gogh AI`}</title>
        <meta name="description" content={getErrorDescription()} />
        <meta name="robots" content="noindex" />
      </Head>
      
      <div className="text-center">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-12 max-w-lg mx-auto">
          {/* 错误状态码图标 */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-white">{statusCode}</span>
            </div>
          </div>
          
          {/* 错误信息 */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {getErrorMessage()}
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            {getErrorDescription()}
          </p>
          
          {/* 操作按钮 */}
          <div className="space-y-4">
            <Link
              href={`/${currentLanguage}`}
              className="inline-block w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {isZh ? '返回首页' : 'Go to Homepage'}
            </Link>
            
            <button
              onClick={() => window.location.reload()}
              className="inline-block w-full px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              {isZh ? '刷新页面' : 'Refresh Page'}
            </button>
          </div>
          
          {/* 联系信息 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              {isZh ? '如果问题持续存在，请联系我们：' : 'If the problem persists, please contact us:'}
            </p>
            <a 
              href="mailto:hangchen.zhu@hiwinda.com"
              className="text-blue-600 hover:underline text-sm"
            >
              hangchen.zhu@hiwinda.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error; 