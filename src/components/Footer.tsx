import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/designers', label: t('nav.designers') },
    { to: '/developers', label: t('nav.developers') },
    { to: '/content-managers', label: t('nav.contentManagers') },
    { to: '/resources', label: t('nav.resources') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xl font-bold text-blue-700 dark:text-blue-400 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-700 dark:bg-blue-600 text-white text-sm font-bold" aria-hidden="true">
                W
              </span>
              WCAG.uz
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-4 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              {t('footer.links')}
            </h2>
            <ul className="space-y-2" role="list">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External Resources */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              {t('footer.social')}
            </h2>
            <ul className="space-y-2" role="list">
              <li>
                <a
                  href="https://www.w3.org/WAI/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                >
                  W3C WAI
                  <span className="sr-only"> (yangi oynada ochiladi)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.w3.org/TR/WCAG22/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                >
                  WCAG 2.2
                  <span className="sr-only"> (yangi oynada ochiladi)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.a11yproject.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                >
                  A11y Project
                  <span className="sr-only"> (yangi oynada ochiladi)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            &copy; {year} WCAG.uz. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
