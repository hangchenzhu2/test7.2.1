/**
 * 根据环境动态生成正确的基础URL
 * 开发环境：http://localhost:3000
 * 生产环境：https://vangoghai.top
 */
export function getBaseUrl() {
  // 检查是否在浏览器环境
  if (typeof window !== 'undefined') {
    // 浏览器环境，使用当前域名
    return window.location.origin;
  }
  
  // 服务端渲染环境
  // 优先使用环境变量
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  if (process.env.NETLIFY_URL) {
    return process.env.NETLIFY_URL;
  }
  
  // 检查是否是开发环境
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // 默认生产环境URL
  return 'https://vangoghai.top';
}

/**
 * 生成带语言路径的URL
 * @param {string} lang - 语言代码
 * @param {string} path - 路径（可选）
 * @returns {string} 完整URL
 */
export function getLocalizedUrl(lang, path = '') {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}/${lang}${cleanPath}`;
}

/**
 * 生成canonical URL
 * @param {string} path - 页面路径
 * @returns {string} 完整URL
 */
export function getCanonicalUrl(path = '') {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl;
} 