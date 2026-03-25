import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function Contact() {
  const { t } = useTranslation();
  const [formState, setFormState] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate form submission
    setFormState('success');
    const form = e.currentTarget;
    form.reset();
    setTimeout(() => setFormState('idle'), 5000);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 dark:from-cyan-900 dark:via-gray-900 dark:to-gray-900 text-white py-16 sm:py-20 selection-on-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              {t('contact.hero.title')}
            </h1>
            <p className="text-lg sm:text-xl text-cyan-100 dark:text-gray-300 leading-relaxed">
              {t('contact.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Form & Info */}
      <div className="py-12 sm:py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              {/* Status messages */}
              {formState === 'success' && (
                <div
                  className="flex items-center gap-3 p-4 mb-6 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300"
                  role="alert"
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <p>{t('contact.form.success')}</p>
                </div>
              )}
              {formState === 'error' && (
                <div
                  className="flex items-center gap-3 p-4 mb-6 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
                  role="alert"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <p>{t('contact.form.error')}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    {t('contact.form.name')} <span className="text-red-500" aria-hidden="true">*</span>
                    <span className="sr-only">({t('contact.form.required')})</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    aria-required="true"
                    autoComplete="name"
                    placeholder={t('contact.form.namePlaceholder')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    {t('contact.form.email')} <span className="text-red-500" aria-hidden="true">*</span>
                    <span className="sr-only">({t('contact.form.required')})</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    aria-required="true"
                    autoComplete="email"
                    placeholder={t('contact.form.emailPlaceholder')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-colors"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    {t('contact.form.subject')} <span className="text-red-500" aria-hidden="true">*</span>
                    <span className="sr-only">({t('contact.form.required')})</span>
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    aria-required="true"
                    placeholder={t('contact.form.subjectPlaceholder')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    {t('contact.form.message')} <span className="text-red-500" aria-hidden="true">*</span>
                    <span className="sr-only">({t('contact.form.required')})</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    required
                    aria-required="true"
                    placeholder={t('contact.form.messagePlaceholder')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-colors resize-y"
                  ></textarea>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-blue-700 dark:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  <Send className="w-5 h-5" aria-hidden="true" />
                  {t('contact.form.submit')}
                </button>
              </form>
            </div>

            {/* Info Sidebar */}
            <aside className="lg:col-span-2">
              <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('contact.info.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  {t('contact.info.description')}
                </p>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                  <Mail className="w-5 h-5 text-blue-700 dark:text-blue-400 flex-shrink-0" aria-hidden="true" />
                  <a
                    href={`mailto:${t('contact.info.email')}`}
                    className="text-blue-700 dark:text-blue-400 font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                  >
                    {t('contact.info.email')}
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
