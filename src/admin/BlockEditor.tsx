import { useState } from 'react';
import type { PageBlock } from './api';
import {
  GripVertical, Trash2, ChevronUp, ChevronDown, ChevronRight,
  Heading, Type, Image, List, Quote, Code, Minus, LayoutGrid, Plus, X
} from 'lucide-react';

interface BlockEditorProps {
  block: PageBlock;
  index: number;
  totalBlocks: number;
  onUpdate: (content: Record<string, unknown>) => void;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
}

const blockIcons: Record<string, typeof Type> = {
  heading: Heading, text: Type, image: Image, list: List,
  quote: Quote, code: Code, divider: Minus, cards: LayoutGrid,
};

const blockLabels: Record<string, string> = {
  heading: 'Sarlavha / Заголовок',
  text: 'Matn / Текст',
  image: 'Rasm / Изображение',
  list: 'Ro\'yxat / Список',
  quote: 'Iqtibos / Цитата',
  code: 'Kod / Код',
  divider: 'Ajratgich / Разделитель',
  cards: 'Kartochkalar / Карточки',
};

export default function BlockEditor({ block, index, totalBlocks, onUpdate, onDelete, onMove }: BlockEditorProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeLang, setActiveLang] = useState<'uz' | 'ru'>('uz');
  const Icon = blockIcons[block.block_type] || Type;
  const label = blockLabels[block.block_type] || block.block_type;

  const c = block.content;
  const set = (key: string, value: unknown) => onUpdate({ ...c, [key]: value });

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-900";

  const LangTabs = () => (
    <div className="flex gap-1 mb-2" role="tablist" aria-label="Til tanlash">
      <button
        type="button"
        role="tab"
        aria-selected={activeLang === 'uz'}
        onClick={() => setActiveLang('uz')}
        className={`px-2.5 py-1 text-xs font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
          ${activeLang === 'uz' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        UZ
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeLang === 'ru'}
        onClick={() => setActiveLang('ru')}
        className={`px-2.5 py-1 text-xs font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
          ${activeLang === 'ru' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        RU
      </button>
    </div>
  );

  const renderBlockContent = () => {
    switch (block.block_type) {
      case 'heading':
        return (
          <div className="space-y-3">
            <div>
              <label htmlFor={`block-${index}-level`} className="block text-xs text-gray-500 mb-1">Daraja / Уровень</label>
              <select
                id={`block-${index}-level`}
                value={(c.level as number) || 2}
                onChange={(e) => set('level', Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              >
                <option value={1}>H1</option>
                <option value={2}>H2</option>
                <option value={3}>H3</option>
                <option value={4}>H4</option>
              </select>
            </div>
            <LangTabs />
            {activeLang === 'uz' ? (
              <div>
                <label htmlFor={`block-${index}-text-uz`} className="block text-xs text-gray-500 mb-1">Matn (O'zbekcha)</label>
                <input id={`block-${index}-text-uz`} type="text" value={(c.text_uz as string) || ''} onChange={(e) => set('text_uz', e.target.value)} className={inputClass} placeholder="Sarlavha matni..." />
              </div>
            ) : (
              <div>
                <label htmlFor={`block-${index}-text-ru`} className="block text-xs text-gray-500 mb-1">Текст (Русский)</label>
                <input id={`block-${index}-text-ru`} type="text" value={(c.text_ru as string) || ''} onChange={(e) => set('text_ru', e.target.value)} className={inputClass} placeholder="Текст заголовка..." />
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2">
            <LangTabs />
            {activeLang === 'uz' ? (
              <div>
                <label htmlFor={`block-${index}-text-uz`} className="block text-xs text-gray-500 mb-1">Matn (O'zbekcha)</label>
                <textarea id={`block-${index}-text-uz`} value={(c.text_uz as string) || ''} onChange={(e) => set('text_uz', e.target.value)} className={`${inputClass} min-h-[120px]`} rows={5} placeholder="Matn yozing..." />
              </div>
            ) : (
              <div>
                <label htmlFor={`block-${index}-text-ru`} className="block text-xs text-gray-500 mb-1">Текст (Русский)</label>
                <textarea id={`block-${index}-text-ru`} value={(c.text_ru as string) || ''} onChange={(e) => set('text_ru', e.target.value)} className={`${inputClass} min-h-[120px]`} rows={5} placeholder="Введите текст..." />
              </div>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="space-y-3">
            <div>
              <label htmlFor={`block-${index}-url`} className="block text-xs text-gray-500 mb-1">Rasm URL</label>
              <input id={`block-${index}-url`} type="text" value={(c.url as string) || ''} onChange={(e) => set('url', e.target.value)} className={inputClass} placeholder="https://..." />
            </div>
            {(c.url as string) && (
              <img src={c.url as string} alt="" className="max-h-32 rounded-lg" />
            )}
            <LangTabs />
            {activeLang === 'uz' ? (
              <>
                <div>
                  <label htmlFor={`block-${index}-alt-uz`} className="block text-xs text-gray-500 mb-1">Muqobil matn (O'zbekcha)</label>
                  <input id={`block-${index}-alt-uz`} type="text" value={(c.alt_uz as string) || ''} onChange={(e) => set('alt_uz', e.target.value)} className={inputClass} placeholder="Rasm tavsifi..." />
                </div>
                <div>
                  <label htmlFor={`block-${index}-caption-uz`} className="block text-xs text-gray-500 mb-1">Izoh (O'zbekcha)</label>
                  <input id={`block-${index}-caption-uz`} type="text" value={(c.caption_uz as string) || ''} onChange={(e) => set('caption_uz', e.target.value)} className={inputClass} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor={`block-${index}-alt-ru`} className="block text-xs text-gray-500 mb-1">Альтернативный текст (Русский)</label>
                  <input id={`block-${index}-alt-ru`} type="text" value={(c.alt_ru as string) || ''} onChange={(e) => set('alt_ru', e.target.value)} className={inputClass} placeholder="Описание изображения..." />
                </div>
                <div>
                  <label htmlFor={`block-${index}-caption-ru`} className="block text-xs text-gray-500 mb-1">Подпись (Русский)</label>
                  <input id={`block-${index}-caption-ru`} type="text" value={(c.caption_ru as string) || ''} onChange={(e) => set('caption_ru', e.target.value)} className={inputClass} />
                </div>
              </>
            )}
          </div>
        );

      case 'list': {
        const itemsKey = activeLang === 'uz' ? 'items_uz' : 'items_ru';
        const items = (c[itemsKey] as string[]) || [''];
        const updateItems = (newItems: string[]) => set(itemsKey, newItems);

        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label htmlFor={`block-${index}-ordered`} className="flex items-center gap-2 cursor-pointer">
                <input
                  id={`block-${index}-ordered`}
                  type="checkbox"
                  checked={!!c.ordered}
                  onChange={(e) => set('ordered', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-600">Tartibli / Нумерованный</span>
              </label>
            </div>
            <LangTabs />
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-6 text-right">{c.ordered ? `${i + 1}.` : '•'}</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[i] = e.target.value;
                      updateItems(newItems);
                    }}
                    className={`${inputClass} flex-1`}
                    aria-label={`${activeLang === 'uz' ? "Element" : "Элемент"} ${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => updateItems(items.filter((_, idx) => idx !== i))}
                    disabled={items.length <= 1}
                    className="p-1.5 text-red-400 hover:text-red-600 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    aria-label={`${i + 1}-elementni o'chirish`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => updateItems([...items, ''])}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <Plus size={14} aria-hidden="true" />
                Qo'shish
              </button>
            </div>
          </div>
        );
      }

      case 'quote':
        return (
          <div className="space-y-2">
            <LangTabs />
            {activeLang === 'uz' ? (
              <>
                <div>
                  <label htmlFor={`block-${index}-quote-uz`} className="block text-xs text-gray-500 mb-1">Iqtibos matni (O'zbekcha)</label>
                  <textarea id={`block-${index}-quote-uz`} value={(c.text_uz as string) || ''} onChange={(e) => set('text_uz', e.target.value)} className={`${inputClass} min-h-[80px]`} rows={3} />
                </div>
                <div>
                  <label htmlFor={`block-${index}-author-uz`} className="block text-xs text-gray-500 mb-1">Muallif (O'zbekcha)</label>
                  <input id={`block-${index}-author-uz`} type="text" value={(c.author_uz as string) || ''} onChange={(e) => set('author_uz', e.target.value)} className={inputClass} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor={`block-${index}-quote-ru`} className="block text-xs text-gray-500 mb-1">Текст цитаты (Русский)</label>
                  <textarea id={`block-${index}-quote-ru`} value={(c.text_ru as string) || ''} onChange={(e) => set('text_ru', e.target.value)} className={`${inputClass} min-h-[80px]`} rows={3} />
                </div>
                <div>
                  <label htmlFor={`block-${index}-author-ru`} className="block text-xs text-gray-500 mb-1">Автор (Русский)</label>
                  <input id={`block-${index}-author-ru`} type="text" value={(c.author_ru as string) || ''} onChange={(e) => set('author_ru', e.target.value)} className={inputClass} />
                </div>
              </>
            )}
          </div>
        );

      case 'code':
        return (
          <div className="space-y-3">
            <div>
              <label htmlFor={`block-${index}-lang`} className="block text-xs text-gray-500 mb-1">Til / Язык</label>
              <select
                id={`block-${index}-lang`}
                value={(c.language as string) || 'html'}
                onChange={(e) => set('language', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              >
                {['html', 'css', 'javascript', 'typescript', 'python', 'json', 'bash'].map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`block-${index}-code`} className="block text-xs text-gray-500 mb-1">Kod</label>
              <textarea
                id={`block-${index}-code`}
                value={(c.code as string) || ''}
                onChange={(e) => set('code', e.target.value)}
                className={`${inputClass} font-mono min-h-[120px]`}
                rows={6}
                spellCheck={false}
              />
            </div>
          </div>
        );

      case 'divider':
        return (
          <div className="py-2">
            <hr className="border-gray-300" />
            <p className="text-xs text-gray-400 text-center mt-1">Gorizontal chiziq / Горизонтальная линия</p>
          </div>
        );

      case 'cards': {
        const cards = (c.cards as Array<{ title_uz: string; title_ru: string; text_uz: string; text_ru: string; link: string }>) || [];

        const updateCard = (cardIndex: number, field: string, value: string) => {
          const newCards = [...cards];
          newCards[cardIndex] = { ...newCards[cardIndex], [field]: value };
          set('cards', newCards);
        };

        const addCard = () => {
          set('cards', [...cards, { title_uz: '', title_ru: '', text_uz: '', text_ru: '', link: '' }]);
        };

        const removeCard = (cardIndex: number) => {
          set('cards', cards.filter((_, i) => i !== cardIndex));
        };

        return (
          <div className="space-y-3">
            <LangTabs />
            {cards.map((card, ci) => (
              <div key={ci} className="border border-gray-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Kartochka {ci + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeCard(ci)}
                    className="p-1 text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    aria-label={`Kartochka ${ci + 1} ni o'chirish`}
                  >
                    <X size={14} />
                  </button>
                </div>
                {activeLang === 'uz' ? (
                  <>
                    <input type="text" value={card.title_uz} onChange={(e) => updateCard(ci, 'title_uz', e.target.value)} className={inputClass} placeholder="Sarlavha (UZ)" aria-label={`Kartochka ${ci + 1} sarlavhasi (UZ)`} />
                    <textarea value={card.text_uz} onChange={(e) => updateCard(ci, 'text_uz', e.target.value)} className={`${inputClass} min-h-[60px]`} rows={2} placeholder="Matn (UZ)" aria-label={`Kartochka ${ci + 1} matni (UZ)`} />
                  </>
                ) : (
                  <>
                    <input type="text" value={card.title_ru} onChange={(e) => updateCard(ci, 'title_ru', e.target.value)} className={inputClass} placeholder="Заголовок (RU)" aria-label={`Kartochka ${ci + 1} sarlavhasi (RU)`} />
                    <textarea value={card.text_ru} onChange={(e) => updateCard(ci, 'text_ru', e.target.value)} className={`${inputClass} min-h-[60px]`} rows={2} placeholder="Текст (RU)" aria-label={`Kartochka ${ci + 1} matni (RU)`} />
                  </>
                )}
                <input type="text" value={card.link} onChange={(e) => updateCard(ci, 'link', e.target.value)} className={inputClass} placeholder="Havola / Ссылка (/page или https://...)" aria-label={`Kartochka ${ci + 1} havolasi`} />
              </div>
            ))}
            <button
              type="button"
              onClick={addCard}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Plus size={14} aria-hidden="true" />
              Kartochka qo'shish
            </button>
          </div>
        );
      }

      default:
        return <p className="text-gray-500 text-sm">Noma'lum blok turi / Неизвестный тип блока</p>;
    }
  };

  return (
    <div className="bg-white">
      {/* Block header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 rounded-t-xl">
        <div
          className="cursor-grab p-1 text-gray-400 hover:text-gray-600"
          aria-label="Blokni sudrab ko'chirish"
        >
          <GripVertical size={16} />
        </div>

        <Icon size={16} className="text-gray-500" aria-hidden="true" />
        <span className="text-sm font-medium text-gray-700 flex-1">{label}</span>

        <button
          type="button"
          onClick={() => onMove('up')}
          disabled={index === 0}
          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-label="Yuqoriga ko'chirish"
        >
          <ChevronUp size={16} />
        </button>
        <button
          type="button"
          onClick={() => onMove('down')}
          disabled={index === totalBlocks - 1}
          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-label="Pastga ko'chirish"
        >
          <ChevronDown size={16} />
        </button>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-label={collapsed ? 'Yoyish' : 'Yig\'ish'}
          aria-expanded={!collapsed}
        >
          <ChevronRight size={16} className={`transition-transform ${collapsed ? '' : 'rotate-90'}`} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-1 text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
          aria-label="Blokni o'chirish"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Block content */}
      {!collapsed && (
        <div className="p-4">
          {renderBlockContent()}
        </div>
      )}
    </div>
  );
}
