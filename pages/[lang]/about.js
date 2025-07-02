import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getTranslation, languages } from "lib/i18n";
import { getCanonicalUrl } from "lib/url-utils";

export default function About() {
  const router = useRouter();
  const { lang } = router.query;
  const currentLanguage = lang || 'en';
  
  const t = (key) => getTranslation(key, currentLanguage);

  const handleLanguageChange = (newLanguage) => {
    router.push(`/${newLanguage}/about`);
  };

  // 动态生成canonical URL
  const canonicalUrl = getCanonicalUrl(`${currentLanguage}/about`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-blue-500 to-teal-400">
      <Head>
        <title>About van Gogh AI - Paint by Text: Ideas to Stunning Visuals</title>
        <meta name="description" content="Learn about van Gogh AI Paint by Text technology. Transform your written ideas into stunning visuals with no art skills needed!" />
        <meta name="keywords" content="van Gogh ai,Paint by Text,InstructPix2Pix,AI image editing Online,image generation,artistic style transformation,about" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <main className="container max-w-4xl mx-auto p-6">
        {/* Language Selector */}
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

        {/* About Content */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-slate-800">{t('about')} {t('appName')}</h1>
            <p className="text-lg text-slate-600">{t('appSubtitle')}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">{t('aboutWhatIs')} {t('appName')}?</h2>
            <p className="mb-6 text-slate-700">
              {t('appName')} {t('aboutWhatIsDesc')}
            </p>

            <h2 className="text-2xl font-bold mb-4 text-slate-800">{t('aboutHowItWorks')}</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl mb-2">📸</div>
                <h3 className="font-bold mb-2">{t('aboutUpload')}</h3>
                <p className="text-sm">{t('aboutUploadDesc')}</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-3xl mb-2">✍️</div>
                <h3 className="font-bold mb-2">{t('aboutDescribe')}</h3>
                <p className="text-sm">{t('aboutDescribeDesc')}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl mb-2">🎨</div>
                <h3 className="font-bold mb-2">{t('aboutTransform')}</h3>
                <p className="text-sm">{t('aboutTransformDesc')}</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-slate-800">{t('aboutTechnology')}</h2>
            <p className="mb-6 text-slate-700">
              {t('aboutTechnologyDesc')}
            </p>

            <h2 className="text-2xl font-bold mb-4 text-slate-800">{t('aboutPrivacy')}</h2>
            <p className="mb-6 text-slate-700">
              {t('aboutPrivacyDesc')}
            </p>

            <div className="text-center mt-8">
              <Link 
                href={`/${currentLanguage}`}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                ← {t('backTo')} {t('appName')}
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
    fallback: false, // 只预生成支持的语言，其他返回404
  };
}

// 静态生成时获取props
export async function getStaticProps(context) {
  const { lang } = context.params;
  
  // 双重检查：如果语言不支持，不应该到达这里（因为fallback: false）
  if (!languages[lang]) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      lang, // 传递语言参数给组件
    },
    revalidate: false, // 静态生成，不需要重新验证
  };
} 