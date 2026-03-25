import { useTranslation } from 'react-i18next';
import { FormInput, MousePointerClick, Languages, LayoutList, ListOrdered, Tag, Puzzle, Keyboard, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';

const cardIcons = [FormInput, MousePointerClick, Languages, LayoutList, ListOrdered, Tag, Puzzle, Keyboard, ShieldAlert];

export default function Developers() {
  const { t } = useTranslation();
  const cards = t('developers.cards', { returnObjects: true }) as {
    title: string;
    description: string;
    criterion: string;
    criterionUrl: string;
  }[];
  const additionalCriteria = t('developers.additionalCriteria', { returnObjects: true }) as {
    code: string;
    level: string;
    title: string;
    description: string;
    url: string;
  }[];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 dark:from-emerald-900 dark:via-gray-900 dark:to-gray-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              {t('developers.hero.title')}
            </h1>
            <p className="text-lg sm:text-xl text-emerald-100 dark:text-gray-300 leading-relaxed">
              {t('developers.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="py-12 sm:py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro */}
          <p className="text-center text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto mb-12">
            {t('developers.intro')}
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, idx) => {
              const Icon = cardIcons[idx];
              return (
                <article
                  key={idx}
                  className="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                      {card.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm flex-grow mb-5">
                    {card.description}
                  </p>
                  <a
                    href={card.criterionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors mt-auto"
                  >
                    {card.criterion}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </article>
              );
            })}
          </div>

          {/* Additional Criteria */}
          <section className="mt-16" aria-labelledby="additional-dev-criteria-heading">
            <h2
              id="additional-dev-criteria-heading"
              className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"
            >
              {t('developers.additionalTitle')}
            </h2>
            <div className="space-y-4 max-w-4xl mx-auto">
              {additionalCriteria.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                      {item.code}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                      item.level === 'AAA'
                        ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300'
                        : item.level === 'AA'
                        ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                        : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                    }`}>
                      {item.level}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                    {item.description}
                  </p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors"
                  >
                    WCAG {item.code}
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
