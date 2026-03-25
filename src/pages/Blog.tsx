import { useTranslation } from 'react-i18next';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';

export default function Blog() {
  const { t } = useTranslation();

  const posts = t('blog.posts', { returnObjects: true }) as Array<{
    id: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    tags: string[];
  }>;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(t('language.uz') === "O'zbekcha" ? 'uz-UZ' : 'ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-600 via-pink-700 to-purple-800 dark:from-rose-900 dark:via-gray-900 dark:to-gray-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              {t('blog.hero.title')}
            </h1>
            <p className="text-lg sm:text-xl text-rose-100 dark:text-gray-300 leading-relaxed">
              {t('blog.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Posts */}
      <div className="py-12 sm:py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group p-6 sm:p-8 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-rose-300 dark:hover:border-rose-600 hover:shadow-md transition-all"
              >
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300"
                    >
                      <Tag className="w-3 h-3" aria-hidden="true" />
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-rose-700 dark:group-hover:text-rose-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <User className="w-4 h-4" aria-hidden="true" />
                    {post.author}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-400 font-medium group-hover:gap-2 transition-all cursor-pointer">
                  {t('blog.readMore')}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
