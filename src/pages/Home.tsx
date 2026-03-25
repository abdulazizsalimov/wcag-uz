import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, Pointer, Brain, Shield, Palette, Code, FileText, ArrowRight, Scale, CheckCircle, Clock, Search, ExternalLink } from 'lucide-react';

const wcagPrincipleIcons = [Eye, Pointer, Brain, Shield];
const principleColors = [
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-violet-500 to-purple-500',
  'from-orange-500 to-amber-500',
];

export default function Home() {
  const { t } = useTranslation();

  const cards = t('home.sections.forWhom.cards', { returnObjects: true }) as Array<{
    title: string;
    description: string;
    link: string;
  }>;
  const stats = t('home.stats.items', { returnObjects: true }) as Array<{
    number: string;
    label: string;
  }>;

  const wcagPrinciples = t('home.sections.wcag.principles', { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;
  const wcagVersions = t('home.sections.wcag.versions', { returnObjects: true }) as Array<{
    name: string;
    year: string;
    description: string;
  }>;
  const wcagLevels = t('home.sections.wcag.levels', { returnObjects: true }) as Array<{
    level: string;
    name: string;
    description: string;
    requirements: string[];
  }>;

  const cardLinks = ['/designers', '/developers', '/content-managers'];
  const cardIcons = [Palette, Code, FileText];
  const levelBadgeColors = [
    'bg-yellow-400 text-yellow-900',
    'bg-blue-500 text-white',
    'bg-purple-600 text-white',
  ];
  const levelBorderColors = [
    'border-yellow-300 dark:border-yellow-700 hover:border-yellow-400 dark:hover:border-yellow-500',
    'border-blue-300 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500',
    'border-purple-300 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500',
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 dark:from-blue-900 dark:via-gray-900 dark:to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" aria-hidden="true"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                {t('home.hero.title')}
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 dark:text-gray-300 mb-8 leading-relaxed">
                {t('home.hero.subtitle')}
              </p>
              <Link
                to="/developers"
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700"
              >
                {t('home.hero.cta')}
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>
            <div className="hidden lg:block">
              <h2 className="text-xl font-bold text-white mb-4">{t('home.stats.title')}</h2>
              <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20"
                >
                  <p className="text-3xl font-bold text-white mb-1">{stat.number}</p>
                  <p className="text-sm text-blue-200">{stat.label}</p>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats mobile only */}
      <section className="lg:hidden py-10 bg-blue-50 dark:bg-gray-800/50" aria-labelledby="stats-heading-mobile">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 id="stats-heading-mobile" className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">{t('home.stats.title')}</h2>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="text-center p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <p className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-400 mb-1">{stat.number}</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WCAG bu nima? — intro split layout */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900" aria-labelledby="wcag-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-3">
              <h2 id="wcag-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {t('home.sections.wcag.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                {t('home.sections.wcag.description')}
              </p>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-amber-900 dark:text-amber-200 text-sm leading-relaxed">
                  {t('home.sections.wcag.lawNote')}
                </p>
              </div>
              <div className="mt-6 flex flex-col items-start gap-3">
                <Link
                  to="/wcag-guide"
                  className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  {t('home.sections.wcag.ctaInternal')}
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
                <a
                  href="https://www.w3.org/TR/WCAG22/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t('home.sections.wcag.ctaExternal')}
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="lg:col-span-2 flex flex-col gap-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {t('home.sections.wcag.pourTitle')}
              </h3>
              {wcagPrinciples.map((principle, idx) => {
                const Icon = wcagPrincipleIcons[idx];
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${principleColors[idx]} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5">
                        {principle.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                );
              })}
              <p className="text-xs text-gray-400 dark:text-gray-500 italic mt-1">
                {t('home.sections.wcag.pourNote')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WCAG Versions — horizontal cards */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800/50" aria-labelledby="versions-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="versions-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {t('home.sections.wcag.versionsTitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('home.sections.wcag.versionsDescription')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {wcagVersions.map((version, idx) => (
              <div
                key={idx}
                className="group relative p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-700 dark:text-blue-400" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{version.name}</h3>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{version.year}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                  {version.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Levels — 3 equal cards */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900" aria-labelledby="levels-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="levels-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {t('home.sections.wcag.levelsTitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('home.sections.wcag.levelsDescription')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wcagLevels.map((level, idx) => (
              <div
                key={idx}
                className={`relative p-6 rounded-xl bg-white dark:bg-gray-800 border-2 ${levelBorderColors[idx]} transition-all hover:shadow-lg flex flex-col`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-flex items-center justify-center w-11 h-11 rounded-xl text-lg font-black ${levelBadgeColors[idx]}`}>
                    {level.level}
                  </span>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{level.name}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {level.description}
                </p>
                <ul className="space-y-2 mt-auto">
                  {level.requirements.map((req, reqIdx) => (
                    <li key={reqIdx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500 dark:text-green-400" aria-hidden="true" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment CTA — split layout */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-900" aria-labelledby="assessment-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-5">
                <Search className="w-7 h-7 text-green-700 dark:text-green-400" aria-hidden="true" />
              </div>
              <h2 id="assessment-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('home.sections.wcag.assessmentTitle')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                {t('home.sections.wcag.assessmentDescription')}
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm leading-relaxed italic">
                {t('home.sections.wcag.assessmentNote')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-center">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-5 h-5 text-blue-700 dark:text-blue-400" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">WAVE</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Web Accessibility Evaluation</p>
              </div>
              <div className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-center">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-5 h-5 text-purple-700 dark:text-purple-400" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">IBM Equal Access</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Accessibility Checker</p>
              </div>
              <div className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-center">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-5 h-5 text-green-700 dark:text-green-400" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Axe DevTools</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Browser Extension</p>
              </div>
              <div className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-center">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mx-auto mb-3">
                  <Code className="w-5 h-5 text-orange-700 dark:text-orange-400" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Lighthouse</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Chrome DevTools</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Whom Cards */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800/50" aria-labelledby="for-whom-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="for-whom-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            {t('home.sections.forWhom.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((card, idx) => {
              const Icon = cardIcons[idx];
              return (
                <Link
                  key={idx}
                  to={cardLinks[idx]}
                  className="group block p-8 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-blue-700 dark:text-blue-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {card.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 font-medium group-hover:gap-2 transition-all">
                    {card.link}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
