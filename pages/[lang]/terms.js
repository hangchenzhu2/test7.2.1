import Head from 'next/head';
import Link from 'next/link';
import { languages, getTranslation } from '../../lib/i18n';
import { getBaseUrl, getCanonicalUrl } from '../../lib/url-utils';

export default function Terms({ lang: langFromProps }) {
  const currentLanguage = langFromProps;
  const baseUrl = getBaseUrl();
  const canonicalUrl = getCanonicalUrl(`/${currentLanguage}/terms`);
  
  const t = (key) => getTranslation(key, currentLanguage);
  
  const handleLanguageChange = (newLanguage) => {
    window.location.href = `/${newLanguage}/terms`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50">
      <Head>
        <title>Terms of Service - van Gogh AI Paint by Text</title>
        <meta name="description" content="Terms of Service for van Gogh AI Paint by Text application. Learn about usage rights, responsibilities, and service terms." />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Hreflang tags for all supported languages */}
        {Object.keys(languages).map((langCode) => (
          <link
            key={langCode}
            rel="alternate"
            hrefLang={langCode}
            href={getCanonicalUrl(`/${langCode}/terms`)}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={getCanonicalUrl('/en/terms')} />
        
        <meta property="og:title" content="Terms of Service - van Gogh AI" />
        <meta property="og:description" content="Terms of Service for van Gogh AI Paint by Text application." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Terms of Service - van Gogh AI" />
        <meta name="twitter:description" content="Terms of Service for van Gogh AI Paint by Text application." />
      </Head>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 语言选择器 */}
        <div className="flex justify-end mb-6">
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                className="inline-flex items-center justify-center w-full rounded-xl bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-all duration-200"
                onClick={() => {
                  const selector = document.getElementById('language-selector');
                  selector.classList.toggle('hidden');
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                {languages[currentLanguage]}
                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div id="language-selector" className="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white/95 backdrop-blur-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-40 max-h-64 overflow-y-auto">
              <div className="py-1">
                {Object.entries(languages).map(([code, name]) => (
                  <button
                    key={code}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 flex items-center ${
                      currentLanguage === code
                        ? 'bg-indigo-100 text-indigo-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleLanguageChange(code)}
                  >
                    {currentLanguage === code && (
                      <svg className="w-4 h-4 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 服务条款内容 */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-slate-800">{t('termsOfService')}</h1>
            <p className="text-lg text-slate-600">van Gogh AI Paint by Text</p>
            <p className="text-sm text-slate-500 mt-2">Last updated: January 2025</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-6">
            {currentLanguage === 'zh' ? (
              <>
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">1. 服务条款接受</h2>
                  <p className="text-slate-700 mb-4">
                    欢迎使用van Gogh AI Paint by Text服务。通过访问和使用我们的服务，您同意受这些服务条款的约束。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">2. 服务描述</h2>
                  <p className="text-slate-700 mb-4">
                    van Gogh AI是一个基于人工智能的图像编辑服务，允许用户通过文本指令修改图片。
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li>AI驱动的图像编辑和处理</li>
                    <li>基于文本描述的图片修改</li>
                    <li>实时图像生成和优化</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">3. 用户责任</h2>
                  <p className="text-slate-700 mb-4">使用我们的服务时，您同意：</p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li>不上传违法、有害或不当的内容</li>
                    <li>不侵犯他人的知识产权</li>
                    <li>不滥用或试图破坏我们的服务</li>
                    <li>对您上传的内容承担全部责任</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">4. 知识产权</h2>
                  <p className="text-slate-700 mb-4">
                    您保留对原始上传内容的所有权利。通过使用我们的服务生成的内容，您拥有使用权。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">5. 服务限制</h2>
                  <p className="text-slate-700 mb-4">我们保留以下权利：</p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li>限制服务使用频率</li>
                    <li>暂停或终止滥用服务的账户</li>
                    <li>修改或更新服务功能</li>
                    <li>在合理通知后终止服务</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">6. 免责声明</h2>
                  <p className="text-slate-700 mb-4">
                    我们的服务按"现状"提供，不提供任何明示或暗示的保证。我们不对服务中断、数据丢失或其他损失承担责任。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">7. 联系我们</h2>
                  <p className="text-slate-700">
                    如果您对服务条款有任何疑问，请联系我们：
                    <br />
                    邮箱：<a href="mailto:hangchen.zhu@hiwinda.com" className="text-blue-600 hover:underline">hangchen.zhu@hiwinda.com</a>
                  </p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">1. Terms Acceptance</h2>
                  <p className="text-slate-700 mb-4">
                    Welcome to van Gogh AI Paint by Text service. By accessing and using our service, you agree to be bound by these Terms of Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">2. Service Description</h2>
                  <p className="text-slate-700 mb-4">
                    van Gogh AI is an artificial intelligence-powered image editing service that allows users to modify images through text instructions.
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li>AI-driven image editing and processing</li>
                    <li>Text-based image modifications</li>
                    <li>Real-time image generation and optimization</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">3. User Responsibilities</h2>
                  <p className="text-slate-700 mb-4">When using our service, you agree to:</p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li>Not upload illegal, harmful, or inappropriate content</li>
                    <li>Not infringe on others' intellectual property rights</li>
                    <li>Not abuse or attempt to disrupt our service</li>
                    <li>Take full responsibility for content you upload</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">4. Intellectual Property</h2>
                  <p className="text-slate-700 mb-4">
                    You retain all rights to your original uploaded content. You own the usage rights to content generated through our service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">5. Service Limitations</h2>
                  <p className="text-slate-700 mb-4">We reserve the right to:</p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li>Limit service usage frequency</li>
                    <li>Suspend or terminate accounts that abuse the service</li>
                    <li>Modify or update service features</li>
                    <li>Terminate service with reasonable notice</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">6. Disclaimer</h2>
                  <p className="text-slate-700 mb-4">
                    Our service is provided "as is" without any express or implied warranties. We are not liable for service interruptions, data loss, or other damages.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">7. Contact Us</h2>
                  <p className="text-slate-700">
                    If you have any questions about these Terms of Service, please contact us:
                    <br />
                    Email: <a href="mailto:hangchen.zhu@hiwinda.com" className="text-blue-600 hover:underline">hangchen.zhu@hiwinda.com</a>
                  </p>
                </section>
              </>
            )}

            <div className="text-center mt-8 pt-6 border-t">
              <Link 
                href={`/${currentLanguage}`}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                ← {t('backTo')} van Gogh AI
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// 生成所有支持的语言路径
export async function getStaticPaths() {
  const paths = Object.keys(languages).map((lang) => ({
    params: { lang },
  }));

  return {
    paths,
    fallback: false,
  };
}

// 静态生成时获取props
export async function getStaticProps(context) {
  const { lang } = context.params;
  
  if (!languages[lang]) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      lang,
    },
    revalidate: false,
  };
} 