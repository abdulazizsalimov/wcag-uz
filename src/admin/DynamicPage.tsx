import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { publicApi } from './api';
import type { PageBlock } from './api';


interface PageData {
  id: number;
  slug: string;
  title_uz: string;
  title_ru: string;
  meta_description_uz?: string;
  meta_description_ru?: string;
  blocks: PageBlock[];
}

export default function DynamicPage() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language === 'ru' ? 'ru' : 'uz';
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    publicApi.page(slug)
      .then(data => {
        if (data && data.id) {
          setPage(data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center" role="status">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
        <span className="sr-only">Yuklanmoqda...</span>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {lang === 'uz' ? 'Sahifa topilmadi' : 'Страница не найдена'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {lang === 'uz' ? 'Siz qidirayotgan sahifa mavjud emas.' : 'Запрашиваемая страница не существует.'}
        </p>
      </div>
    );
  }

  const title = lang === 'uz' ? page.title_uz : page.title_ru;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{title}</h1>
      <div className="space-y-6">
        {page.blocks.map((block, index) => (
          <RenderBlock key={index} block={block} lang={lang} />
        ))}
      </div>
    </div>
  );
}

function RenderBlock({ block, lang }: { block: PageBlock; lang: 'uz' | 'ru' }) {
  const c = block.content;
  const t = (uzKey: string, ruKey: string) => lang === 'uz' ? (c[uzKey] as string || '') : (c[ruKey] as string || '');

  switch (block.block_type) {
    case 'heading': {
      const level = (c.level as number) || 2;
      const text = t('text_uz', 'text_ru');
      if (!text) return null;
      const sizes: Record<number, string> = {
        1: 'text-3xl font-bold',
        2: 'text-2xl font-bold',
        3: 'text-xl font-semibold',
        4: 'text-lg font-semibold',
      };
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      return <Tag className={`${sizes[level] || sizes[2]} text-gray-900 dark:text-white`}>{text}</Tag>;
    }

    case 'text': {
      const text = t('text_uz', 'text_ru');
      if (!text) return null;
      return <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{text}</p>;
    }

    case 'image': {
      const url = c.url as string;
      if (!url) return null;
      return (
        <figure>
          <img
            src={url}
            alt={t('alt_uz', 'alt_ru')}
            className="rounded-xl max-w-full"
            loading="lazy"
          />
          {t('caption_uz', 'caption_ru') && (
            <figcaption className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              {t('caption_uz', 'caption_ru')}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'list': {
      const items = (lang === 'uz' ? c.items_uz : c.items_ru) as string[] || [];
      if (items.length === 0) return null;
      const ListTag = c.ordered ? 'ol' : 'ul';
      return (
        <ListTag className={`${c.ordered ? 'list-decimal' : 'list-disc'} pl-6 space-y-1`}>
          {items.filter(Boolean).map((item, i) => (
            <li key={i} className="text-gray-700 dark:text-gray-300">{item}</li>
          ))}
        </ListTag>
      );
    }

    case 'quote': {
      const text = t('text_uz', 'text_ru');
      if (!text) return null;
      return (
        <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
          <p className="text-gray-700 dark:text-gray-300 italic">{text}</p>
          {t('author_uz', 'author_ru') && (
            <cite className="text-sm text-gray-500 dark:text-gray-400 not-italic mt-1 block">
              — {t('author_uz', 'author_ru')}
            </cite>
          )}
        </blockquote>
      );
    }

    case 'code': {
      const code = c.code as string;
      if (!code) return null;
      return (
        <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto text-sm">
          <code>{code}</code>
        </pre>
      );
    }

    case 'divider':
      return <hr className="border-gray-200 dark:border-gray-700" />;

    case 'cards': {
      const cards = (c.cards as Array<{ title_uz: string; title_ru: string; text_uz: string; text_ru: string; link: string }>) || [];
      if (cards.length === 0) return null;
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card, i) => {
            const cardTitle = lang === 'uz' ? card.title_uz : card.title_ru;
            const cardText = lang === 'uz' ? card.text_uz : card.text_ru;
            const content = (
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
                {cardTitle && <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{cardTitle}</h3>}
                {cardText && <p className="text-sm text-gray-600 dark:text-gray-400">{cardText}</p>}
              </div>
            );
            return card.link ? (
              <a key={i} href={card.link} className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl">
                {content}
              </a>
            ) : (
              <div key={i}>{content}</div>
            );
          })}
        </div>
      );
    }

    default:
      return null;
  }
}
