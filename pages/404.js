import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Custom404() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-blue-500 to-teal-400 flex items-center justify-center px-4">
      <Head>
        <title>404 - Page Not Found | van Gogh AI</title>
        <meta name="description" content="The page you are looking for could not be found." />
        <meta name="robots" content="noindex" />
      </Head>
      
      <div className="text-center">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-12 max-w-lg mx-auto">
          {/* 404图标 */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-6xl font-bold text-white">404</span>
            </div>
          </div>
          
          {/* 错误信息 */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {isZh ? '页面未找到' : 'Page Not Found'}
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            {isZh 
              ? '抱歉，您访问的页面不存在或已被移动。'
              : 'Sorry, the page you are looking for does not exist or has been moved.'
            }
          </p>
          
          {/* 操作按钮 */}
          <div className="space-y-4">
            <Link
              href={`/${currentLanguage}`}
              className="inline-block w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {isZh ? '返回首页' : 'Go to Homepage'}
            </Link>
            
            <Link
              href={`/${currentLanguage}/about`}
              className="inline-block w-full px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              {isZh ? '关于我们' : 'About Us'}
            </Link>
          </div>
          
          {/* 描述 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {isZh 
                ? '您可以尝试使用导航菜单，或联系我们获取帮助。'
                : 'You can try using the navigation menu, or contact us for help.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 