import { useTranslation } from 'react-i18next';
import { BookOpen, Wrench, GraduationCap, Monitor, ExternalLink } from 'lucide-react';

const sectionIcons = [BookOpen, Wrench, GraduationCap, Monitor];
const sectionKeys = ['standards', 'tools', 'learning', 'screenReaders'] as const;

export default function Resources() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-600 via-orange-700 to-red-800 dark:from-amber-900 dark:via-gray-900 dark:to-gray-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              {t('resources.hero.title')}
            </h1>
            <p className="text-lg sm:text-xl text-amber-100 dark:text-gray-300 leading-relaxed">
              {t('resources.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Sections */}
      <div className="py-12 sm:py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {sectionKeys.map((key, idx) => {
            const Icon = sectionIcons[idx];
            const items = t(`resources.sections.${key}.items`, { returnObjects: true }) as Array<{
              title: string;
              description: string;
              url: string;
            }>;

            return (
              <section key={key} aria-labelledby={`resources-${key}-heading`}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" />
                  </div>
                  <h2 id={`resources-${key}-heading`} className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t(`resources.sections.${key}.title`)}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item, itemIdx) => (
                    <a
                      key={itemIdx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                          {item.title}
                        </h3>
                        <ExternalLink
                          className="w-4 h-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 flex-shrink-0 mt-1 transition-colors"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                      <span className="sr-only"> (yangi oynada ochiladi)</span>
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
