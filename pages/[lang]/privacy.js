import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getTranslation, languages } from "lib/i18n";
import { getCanonicalUrl } from "lib/url-utils";

export default function Privacy() {
  const router = useRouter();
  const { lang } = router.query;
  const currentLanguage = lang || 'en';
  
  const t = (key) => getTranslation(key, currentLanguage);

  const handleLanguageChange = (newLanguage) => {
    router.push(`/${newLanguage}/privacy`);
  };

  // 动态生成canonical URL
  const canonicalUrl = getCanonicalUrl(`${currentLanguage}/privacy`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-blue-500 to-teal-400">
      <Head>
        <title>Privacy Policy - van Gogh AI</title>
        <meta name="description" content="Privacy Policy for van Gogh AI Paint by Text service. Learn how we protect your data and privacy." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <main className="container max-w-4xl mx-auto p-6">
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

        {/* 隐私政策内容 */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-slate-800">{t('privacyPolicy')}</h1>
            <p className="text-lg text-slate-600">van Gogh AI Paint by Text</p>
            <p className="text-sm text-slate-500 mt-2">Last updated: January 2025</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-6">
            {currentLanguage === 'zh' ? (
              <>
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">1. 信息收集</h2>
                  <p className="text-slate-700 mb-4">
                    van Gogh AI 重视您的隐私。我们承诺保护您的个人信息和数据安全。
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li>我们不会永久存储您上传的图片</li>
                    <li>处理完成后，图片会自动删除</li>
                    <li>我们不会收集个人身份信息</li>
                    <li>所有处理都在安全的服务器环境中进行</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">2. 数据使用</h2>
                  <p className="text-slate-700 mb-4">
                    您的图片仅用于AI处理目的：
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li>图片处理和编辑服务</li>
                    <li>改进AI算法性能（匿名化处理）</li>
                    <li>确保服务质量和安全性</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">3. 数据安全</h2>
                  <p className="text-slate-700 mb-4">
                    我们采用行业标准的安全措施保护您的数据：
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li>HTTPS加密传输</li>
                    <li>临时处理，不永久存储</li>
                    <li>定期安全审计</li>
                    <li>访问控制和监控</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">4. 联系我们</h2>
                  <p className="text-slate-700">
                    如果您对我们的隐私政策有任何疑问，请联系我们：
                    <br />
                    邮箱：<a href="mailto:hangchen.zhu@hiwinda.com" className="text-blue-600 hover:underline">hangchen.zhu@hiwinda.com</a>
                  </p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">1. Information Collection</h2>
                  <p className="text-slate-700 mb-4">
                    van Gogh AI values your privacy. We are committed to protecting your personal information and data security.
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li>We do not permanently store your uploaded images</li>
                    <li>Images are automatically deleted after processing</li>
                    <li>We do not collect personal identification information</li>
                    <li>All processing occurs in secure server environments</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">2. Data Usage</h2>
                  <p className="text-slate-700 mb-4">
                    Your images are used solely for AI processing purposes:
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li>Image processing and editing services</li>
                    <li>Improving AI algorithm performance (anonymized)</li>
                    <li>Ensuring service quality and security</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">3. Data Security</h2>
                  <p className="text-slate-700 mb-4">
                    We employ industry-standard security measures to protect your data:
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li>HTTPS encrypted transmission</li>
                    <li>Temporary processing, no permanent storage</li>
                    <li>Regular security audits</li>
                    <li>Access control and monitoring</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">4. Contact Us</h2>
                  <p className="text-slate-700">
                    If you have any questions about our Privacy Policy, please contact us:
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