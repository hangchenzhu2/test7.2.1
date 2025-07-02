import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css'
import '../styles/apple.css'

export default function App({ Component, pageProps }) {
  // 只在生产环境加载Analytics，避免开发环境404错误
  const shouldLoadAnalytics = process.env.NODE_ENV === 'production';
  
  return (
    <>
      <Component {...pageProps} />
      {shouldLoadAnalytics && <Analytics />}
    </>
  );
}
