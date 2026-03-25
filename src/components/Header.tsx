import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, Eye } from 'lucide-react';
import AccessibilityWidget from './AccessibilityWidget';

export default function Header() {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [a11yPanelOpen, setA11yPanelOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/designers', label: t('nav.designers') },
    { to: '/developers', label: t('nav.developers') },
    { to: '/content-managers', label: t('nav.contentManagers') },
    { to: '/resources', label: t('nav.resources') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const switchLanguage = () => {
    const newLang = i18n.language === 'uz' ? 'ru' : 'uz';
    i18n.changeLanguage(newLang);
    localStorage.setItem('wcag-uz-lang', newLang);
    document.documentElement.lang = newLang;
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-blue-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-semibold focus:outline-none focus:ring-2 focus:ring-white"
      >
        {t('nav.skipToContent')}
      </a>
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 rounded-md"
              aria-label={t('site.title')}
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-700 dark:bg-blue-600 text-white text-sm font-bold" aria-hidden="true">
                W
              </span>
              <span>WCAG.uz</span>
            </Link>

            {/* Desktop Navigation */}
            <nav aria-label={t('nav.home')} className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
                    isActive(link.to)
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  aria-current={isActive(link.to) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <button
                onClick={switchLanguage}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                aria-label={t('language.switch')}
              >
                <Globe className="w-4 h-4" aria-hidden="true" />
                <span>{i18n.language === 'uz' ? 'РУ' : 'UZ'}</span>
              </button>

              {/* Accessibility Panel Toggle */}
              <button
                onClick={() => setA11yPanelOpen(true)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                aria-label={t('a11yPanel.open')}
              >
                <Eye className="w-5 h-5" aria-hidden="true" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav
              aria-label={t('nav.home')}
              className="lg:hidden pb-4 border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              <ul className="flex flex-col gap-1" role="list">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        isActive(link.to)
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      aria-current={isActive(link.to) ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </header>
      <AccessibilityWidget open={a11yPanelOpen} onOpenChange={setA11yPanelOpen} />
    </>
  );
}
