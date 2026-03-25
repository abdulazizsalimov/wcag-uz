import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ExternalLink, BookOpen, FileText } from 'lucide-react';

export default function WcagGuide() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 dark:from-indigo-900 dark:via-gray-900 dark:to-gray-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              {t('wcagGuide.hero.title')}
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100 dark:text-gray-300 leading-relaxed">
              {t('wcagGuide.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="py-12 sm:py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-10">
            {t('wcagGuide.intro')}
          </p>

          {/* Coming Soon */}
          <div className="p-8 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-indigo-700 dark:text-indigo-400" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('wcagGuide.comingSoon')}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {t('wcagGuide.comingSoonDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://www.w3.org/TR/WCAG22/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all"
              >
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                {t('wcagGuide.officialLink')}
                <ExternalLink className="w-4 h-4 text-gray-400" aria-hidden="true" />
              </a>
              <a
                href="https://www.w3.org/WAI/WCAG22/quickref/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all"
              >
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                {t('wcagGuide.quickReference')}
                <ExternalLink className="w-4 h-4 text-gray-400" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {t('wcagGuide.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
