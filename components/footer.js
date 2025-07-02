import Link from "next/link";
import { useRouter } from "next/router";
import { getTranslation } from "lib/i18n";

export default function Footer() {
  const router = useRouter();
  const { lang } = router.query;
  const currentLanguage = lang || 'en';
  
  // Helper function to get translation
  const t = (key) => getTranslation(key, currentLanguage);

  return (
    <footer className="w-full mt-16 pt-12 pb-8 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="container max-w-6xl mx-auto px-6">
        {/* 主要链接区域 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* 产品信息 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">van Gogh ai</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('appSubtitle')}
            </p>
          </div>
          
          {/* 产品链接 */}
          <div className="space-y-3">
            <h4 className="text-md font-medium text-gray-700">{t('aboutWhatIs')} van Gogh ai</h4>
            <div className="flex flex-col space-y-2">
              <Link href={`/${currentLanguage}/about`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                {t('aboutUs')}
              </Link>
              <Link href={`/${currentLanguage}`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                {t('heroTitle')}
              </Link>
            </div>
          </div>
          
          {/* 法律链接 */}
          <div className="space-y-3">
            <h4 className="text-md font-medium text-gray-700">Legal</h4>
            <div className="flex flex-col space-y-2">
              <Link href={`/${currentLanguage}/privacy`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                {t('privacyPolicy')}
              </Link>
              <Link href={`/${currentLanguage}/terms`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                {t('termsOfService')}
              </Link>
            </div>
          </div>
          
          {/* 联系信息 */}
          <div className="space-y-3">
            <h4 className="text-md font-medium text-gray-700">{t('contact')}</h4>
            <div className="flex flex-col space-y-2">
              <a href="mailto:hangchen.zhu@hiwinda.com" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                hangchen.zhu@hiwinda.com
              </a>
              <p className="text-xs text-gray-500">
                {t('contactForMoreQuestions')}
              </p>
            </div>
          </div>
        </div>
        
        {/* 分隔线 */}
        <div className="border-t border-gray-300 pt-6">
          {/* 版权和技术信息 */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600 mb-1">
                {t('footerCopyright')}
              </p>
              <p className="text-xs text-gray-500">
                {t('allRightsReserved')}
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-xs text-gray-500">
                {t('footerPowered')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
