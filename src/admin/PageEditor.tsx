import { useState, useEffect, useCallback, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pagesApi, type PageBlock } from './api';
import BilingualInput from './BilingualInput';
import AdminLayout from './AdminLayout';
import BlockEditor from './BlockEditor';
import {
  Save, ArrowLeft, Check, AlertCircle, Eye, EyeOff,
  Plus, Type, Heading, Image, List, Quote, Code, Minus, LayoutGrid
} from 'lucide-react';

const BLOCK_TYPES = [
  { type: 'heading', label: 'Sarlavha / Заголовок', icon: Heading },
  { type: 'text', label: 'Matn / Текст', icon: Type },
  { type: 'image', label: 'Rasm / Изображение', icon: Image },
  { type: 'list', label: 'Ro\'yxat / Список', icon: List },
  { type: 'quote', label: 'Iqtibos / Цитата', icon: Quote },
  { type: 'code', label: 'Kod / Код', icon: Code },
  { type: 'divider', label: 'Ajratgich / Разделитель', icon: Minus },
  { type: 'cards', label: 'Kartochkalar / Карточки', icon: LayoutGrid },
];

function getDefaultContent(type: string): Record<string, unknown> {
  switch (type) {
    case 'heading':
      return { text_uz: '', text_ru: '', level: 2 };
    case 'text':
      return { text_uz: '', text_ru: '' };
    case 'image':
      return { url: '', alt_uz: '', alt_ru: '', caption_uz: '', caption_ru: '' };
    case 'list':
      return { items_uz: [''], items_ru: [''], ordered: false };
    case 'quote':
      return { text_uz: '', text_ru: '', author_uz: '', author_ru: '' };
    case 'code':
      return { code: '', language: 'html' };
    case 'divider':
      return {};
    case 'cards':
      return { cards: [{ title_uz: '', title_ru: '', text_uz: '', text_ru: '', link: '' }] };
    default:
      return {};
  }
}

export default function PageEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [slug, setSlug] = useState('');
  const [titleUz, setTitleUz] = useState('');
  const [titleRu, setTitleRu] = useState('');
  const [metaUz, setMetaUz] = useState('');
  const [metaRu, setMetaRu] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [previewLang, setPreviewLang] = useState<'uz' | 'ru'>('uz');
  const [showPreview, setShowPreview] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isNew && id) {
      pagesApi.get(Number(id)).then(data => {
        setSlug(data.slug || '');
        setTitleUz(data.title_uz || '');
        setTitleRu(data.title_ru || '');
        setMetaUz(data.meta_description_uz || '');
        setMetaRu(data.meta_description_ru || '');
        setIsPublished(data.is_published || false);
        setBlocks(data.blocks || []);
      }).catch(() => {
        setMessage({ type: 'error', text: 'Sahifani yuklashda xatolik' });
      }).finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const generateSlug = useCallback((text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/ʻ|ʼ|'/g, '')
      .substring(0, 60);
  }, []);

  const handleTitleUzChange = (value: string) => {
    setTitleUz(value);
    if (isNew && !slug) {
      setSlug(generateSlug(value));
    }
  };

  const addBlock = (type: string) => {
    const newBlock: PageBlock = {
      block_type: type,
      content: getDefaultContent(type),
      order_index: blocks.length,
    };
    setBlocks(prev => [...prev, newBlock]);
    setShowBlockMenu(false);
  };

  const updateBlock = (index: number, content: Record<string, unknown>) => {
    setBlocks(prev => prev.map((b, i) => i === index ? { ...b, content } : b));
  };

  const deleteBlock = (index: number) => {
    setBlocks(prev => prev.filter((_, i) => i !== index).map((b, i) => ({ ...b, order_index: i })));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
    setBlocks(newBlocks.map((b, i) => ({ ...b, order_index: i })));
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newBlocks = [...blocks];
    const draggedBlock = newBlocks[dragIndex];
    newBlocks.splice(dragIndex, 1);
    newBlocks.splice(index, 0, draggedBlock);
    setBlocks(newBlocks.map((b, i) => ({ ...b, order_index: i })));
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!slug || !titleUz) {
      setMessage({ type: 'error', text: 'Slug va sarlavha to\'ldirilishi shart' });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const pageData = {
        slug,
        title_uz: titleUz,
        title_ru: titleRu,
        meta_description_uz: metaUz,
        meta_description_ru: metaRu,
        is_published: isPublished,
      };

      let pageId: number;
      if (isNew) {
        const created = await pagesApi.create(pageData);
        pageId = created.id;
      } else {
        await pagesApi.update(Number(id), pageData);
        pageId = Number(id);
      }

      if (blocks.length > 0) {
        await pagesApi.updateBlocks(pageId, blocks);
      }

      setMessage({ type: 'success', text: 'Sahifa saqlandi! / Страница сохранена!' });
      if (isNew) {
        navigate(`/admin/pages/${pageId}`, { replace: true });
      }
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Saqlashda xatolik' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center gap-2 text-gray-500" role="status">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
          <span>Yuklanmoqda...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/admin/pages')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            aria-label="Sahifalar ro'yxatiga qaytish"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? 'Yangi sahifa' : 'Sahifani tahrirlash'}
            </h1>
            <p className="text-gray-500 text-sm">
              {isNew ? 'Yangi sahifa yaratish / Создание новой страницы' : 'Sahifani tahrirlash / Редактирование страницы'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                showPreview ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye size={16} aria-hidden="true" />
              Ko'rish
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
              message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
            }`}
            role="alert"
          >
            {message.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
          {/* Editor */}
          <div>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Page Settings */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <h2 className="font-semibold text-gray-900">Sahifa sozlamalari / Настройки страницы</h2>

                <BilingualInput
                  id="page-title"
                  labelUz="Sahifa sarlavhasi"
                  labelRu="Заголовок страницы"
                  valueUz={titleUz}
                  valueRu={titleRu}
                  onChangeUz={handleTitleUzChange}
                  onChangeRu={setTitleRu}
                  required
                />

                <div>
                  <label htmlFor="page-slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (URL yo'li)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">/page/</span>
                    <input
                      id="page-slug"
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                      required
                      pattern="[a-z0-9-]+"
                    />
                  </div>
                </div>

                <BilingualInput
                  id="page-meta"
                  labelUz="Meta tavsifi"
                  labelRu="Мета-описание"
                  valueUz={metaUz}
                  valueRu={metaRu}
                  onChangeUz={setMetaUz}
                  onChangeRu={setMetaRu}
                  multiline
                />

                <div className="flex items-center gap-3">
                  <label htmlFor="page-published" className="flex items-center gap-2 cursor-pointer">
                    <input
                      id="page-published"
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      {isPublished ? <Eye size={16} aria-hidden="true" /> : <EyeOff size={16} aria-hidden="true" />}
                      {isPublished ? 'Chop etilgan / Опубликовано' : 'Qoralama / Черновик'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Blocks */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Sahifa bloklari / Блоки страницы</h2>

                <div className="space-y-3" role="list" aria-label="Sahifa bloklari">
                  {blocks.map((block, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`border rounded-xl transition-all ${
                        dragIndex === index ? 'border-blue-400 shadow-lg opacity-75' : 'border-gray-200'
                      }`}
                      role="listitem"
                      aria-label={`${block.block_type} bloki, pozitsiya ${index + 1}`}
                    >
                      <BlockEditor
                        block={block}
                        index={index}
                        totalBlocks={blocks.length}
                        onUpdate={(content) => updateBlock(index, content)}
                        onDelete={() => deleteBlock(index)}
                        onMove={(direction) => moveBlock(index, direction)}
                      />
                    </div>
                  ))}
                </div>

                {/* Add block */}
                <div className="mt-4 relative">
                  <button
                    type="button"
                    onClick={() => setShowBlockMenu(!showBlockMenu)}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
                  >
                    <Plus size={20} aria-hidden="true" />
                    Blok qo'shish / Добавить блок
                  </button>

                  {showBlockMenu && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-10">
                      <p className="text-sm font-medium text-gray-700 mb-2">Blok turini tanlang / Выберите тип блока</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {BLOCK_TYPES.map((bt) => (
                          <button
                            key={bt.type}
                            type="button"
                            onClick={() => addBlock(bt.type)}
                            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <bt.icon size={20} className="text-gray-600" aria-hidden="true" />
                            <span className="text-xs text-gray-700 text-center">{bt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Save */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/pages')}
                  className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Bekor qilish / Отмена
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                  <Save size={18} aria-hidden="true" />
                  {saving ? 'Saqlanmoqda...' : 'Saqlash / Сохранить'}
                </button>
              </div>
            </form>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Ko'rinish / Предпросмотр</h2>
                <div className="flex gap-1" role="tablist" aria-label="Ko'rinish tili">
                  <button
                    role="tab"
                    aria-selected={previewLang === 'uz'}
                    onClick={() => setPreviewLang('uz')}
                    className={`px-3 py-1 text-sm rounded ${previewLang === 'uz' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    UZ
                  </button>
                  <button
                    role="tab"
                    aria-selected={previewLang === 'ru'}
                    onClick={() => setPreviewLang('ru')}
                    className={`px-3 py-1 text-sm rounded ${previewLang === 'ru' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    RU
                  </button>
                </div>
              </div>

              <div className="prose max-w-none">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {previewLang === 'uz' ? titleUz || 'Sarlavha' : titleRu || 'Заголовок'}
                </h1>

                {blocks.map((block, index) => (
                  <PreviewBlock key={index} block={block} lang={previewLang} />
                ))}

                {blocks.length === 0 && (
                  <p className="text-gray-400 italic">Bloklar qo'shing / Добавьте блоки</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function PreviewBlock({ block, lang }: { block: PageBlock; lang: 'uz' | 'ru' }) {
  const c = block.content;
  const t = (uzKey: string, ruKey: string) => lang === 'uz' ? (c[uzKey] as string || '') : (c[ruKey] as string || '');

  switch (block.block_type) {
    case 'heading': {
      const level = (c.level as number) || 2;
      const text = t('text_uz', 'text_ru');
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      const sizes: Record<number, string> = { 1: 'text-3xl', 2: 'text-2xl', 3: 'text-xl', 4: 'text-lg' };
      return <Tag className={`${sizes[level] || 'text-xl'} font-bold text-gray-900 my-3`}>{text || '...'}</Tag>;
    }
    case 'text':
      return <p className="text-gray-700 my-2 whitespace-pre-wrap">{t('text_uz', 'text_ru') || '...'}</p>;
    case 'image':
      return (
        <figure className="my-4">
          {(c.url as string) ? (
            <img src={c.url as string} alt={t('alt_uz', 'alt_ru')} className="rounded-lg max-w-full" />
          ) : (
            <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center text-gray-400">
              <Image size={32} />
            </div>
          )}
          {t('caption_uz', 'caption_ru') && (
            <figcaption className="text-sm text-gray-500 mt-1">{t('caption_uz', 'caption_ru')}</figcaption>
          )}
        </figure>
      );
    case 'list': {
      const items = (lang === 'uz' ? c.items_uz : c.items_ru) as string[] || [];
      const ListTag = c.ordered ? 'ol' : 'ul';
      return (
        <ListTag className={`my-2 pl-5 ${c.ordered ? 'list-decimal' : 'list-disc'}`}>
          {items.map((item, i) => <li key={i} className="text-gray-700">{item || '...'}</li>)}
        </ListTag>
      );
    }
    case 'quote':
      return (
        <blockquote className="border-l-4 border-blue-400 pl-4 my-4 italic text-gray-600">
          <p>{t('text_uz', 'text_ru') || '...'}</p>
          {t('author_uz', 'author_ru') && (
            <cite className="text-sm not-italic text-gray-500">— {t('author_uz', 'author_ru')}</cite>
          )}
        </blockquote>
      );
    case 'code':
      return (
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto my-4 text-sm">
          <code>{(c.code as string) || '// code...'}</code>
        </pre>
      );
    case 'divider':
      return <hr className="my-6 border-gray-200" />;
    case 'cards': {
      const cards = (c.cards as Array<{ title_uz: string; title_ru: string; text_uz: string; text_ru: string; link: string }>) || [];
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {cards.map((card, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900">{lang === 'uz' ? card.title_uz : card.title_ru || '...'}</h3>
              <p className="text-sm text-gray-600 mt-1">{lang === 'uz' ? card.text_uz : card.text_ru || '...'}</p>
            </div>
          ))}
        </div>
      );
    }
    default:
      return <div className="bg-gray-100 p-3 rounded my-2 text-gray-500">Noma'lum blok turi: {block.block_type}</div>;
  }
}
