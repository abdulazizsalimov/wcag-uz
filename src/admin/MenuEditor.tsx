import { useState, useEffect } from 'react';
import { menuApi, pagesApi, type Page } from './api';
import AdminLayout from './AdminLayout';
import { Plus, GripVertical, Trash2, Save, Check, AlertCircle, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';

interface MenuItem {
  id: number;
  label_uz: string;
  label_ru: string;
  path: string;
  order_index: number;
  is_visible: boolean;
  page_id: number | null;
}

export default function MenuEditor() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newItem, setNewItem] = useState({ label_uz: '', label_ru: '', path: '' });
  const [showAdd, setShowAdd] = useState(false);

  const loadData = async () => {
    try {
      const [menuData, pagesData] = await Promise.all([
        menuApi.list(),
        pagesApi.list().catch(() => []),
      ]);
      setItems(Array.isArray(menuData) ? menuData : []);
      setPages(Array.isArray(pagesData) ? pagesData : []);
    } catch {
      setMessage({ type: 'error', text: 'Ma\'lumotlarni yuklashda xatolik' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async () => {
    if (!newItem.label_uz || !newItem.path) return;
    setSaving(true);
    try {
      await menuApi.create({
        label_uz: newItem.label_uz,
        label_ru: newItem.label_ru,
        path: newItem.path,
        order_index: items.length,
        is_visible: true,
      });
      setNewItem({ label_uz: '', label_ru: '', path: '' });
      setShowAdd(false);
      await loadData();
      setMessage({ type: 'success', text: 'Menyu elementi qo\'shildi' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'Qo\'shishda xatolik' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (item: MenuItem) => {
    setSaving(true);
    try {
      await menuApi.update(item.id, {
        label_uz: item.label_uz,
        label_ru: item.label_ru,
        path: item.path,
        order_index: item.order_index,
        is_visible: item.is_visible,
        page_id: item.page_id,
      });
      setMessage({ type: 'success', text: 'Saqlandi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'Saqlashda xatolik' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('O\'chirishni tasdiqlaysizmi? / Подтвердите удаление?')) return;
    try {
      await menuApi.delete(id);
      await loadData();
      setMessage({ type: 'success', text: 'O\'chirildi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'O\'chirishda xatolik' });
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newItems.length) return;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    setItems(newItems);
    try {
      await menuApi.reorder(newItems.map(i => i.id));
    } catch {
      setMessage({ type: 'error', text: 'Tartibni o\'zgartirishda xatolik' });
      await loadData();
    }
  };

  const toggleVisibility = async (item: MenuItem) => {
    const updated = { ...item, is_visible: !item.is_visible };
    setItems(prev => prev.map(i => i.id === item.id ? updated : i));
    await handleUpdate(updated);
  };

  const updateItem = (id: number, field: keyof MenuItem, value: string | number | boolean | null) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Menyuni boshqarish</h1>
            <p className="text-gray-500">Sayt menyusini tahrirlash / Управление меню сайта</p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Plus size={18} aria-hidden="true" />
            Qo'shish
          </button>
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

        {showAdd && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <h2 className="font-semibold text-gray-900 mb-3">Yangi menyu elementi / Новый пункт меню</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label htmlFor="new-label-uz" className="block text-sm font-medium text-gray-700 mb-1">Nomi (O'zbekcha)</label>
                <input
                  id="new-label-uz"
                  type="text"
                  value={newItem.label_uz}
                  onChange={(e) => setNewItem(prev => ({ ...prev, label_uz: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                  placeholder="Bosh sahifa"
                />
              </div>
              <div>
                <label htmlFor="new-label-ru" className="block text-sm font-medium text-gray-700 mb-1">Название (Русский)</label>
                <input
                  id="new-label-ru"
                  type="text"
                  value={newItem.label_ru}
                  onChange={(e) => setNewItem(prev => ({ ...prev, label_ru: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                  placeholder="Главная"
                />
              </div>
              <div>
                <label htmlFor="new-path" className="block text-sm font-medium text-gray-700 mb-1">Yo'l / Путь</label>
                <input
                  id="new-path"
                  type="text"
                  value={newItem.path}
                  onChange={(e) => setNewItem(prev => ({ ...prev, path: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                  placeholder="/page-slug"
                />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleAdd}
                disabled={saving || !newItem.label_uz || !newItem.path}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                <Plus size={16} aria-hidden="true" />
                Qo'shish / Добавить
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Bekor qilish / Отмена
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2" role="list" aria-label="Menyu elementlari">
          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Menyu elementlari yo'q / Нет элементов меню</p>
          ) : (
            items.map((item, index) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl border border-gray-200 p-4 ${!item.is_visible ? 'opacity-60' : ''}`}
                role="listitem"
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 pt-1">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      aria-label={`${item.label_uz} ni yuqoriga ko'chirish`}
                    >
                      <ChevronUp size={16} />
                    </button>
                    <GripVertical size={16} className="text-gray-300 mx-auto" aria-hidden="true" />
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === items.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      aria-label={`${item.label_uz} ni pastga ko'chirish`}
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label htmlFor={`item-${item.id}-uz`} className="block text-xs text-gray-500 mb-1">O'zbekcha</label>
                      <input
                        id={`item-${item.id}-uz`}
                        type="text"
                        value={item.label_uz}
                        onChange={(e) => updateItem(item.id, 'label_uz', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-900"
                      />
                    </div>
                    <div>
                      <label htmlFor={`item-${item.id}-ru`} className="block text-xs text-gray-500 mb-1">Русский</label>
                      <input
                        id={`item-${item.id}-ru`}
                        type="text"
                        value={item.label_ru}
                        onChange={(e) => updateItem(item.id, 'label_ru', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-900"
                      />
                    </div>
                    <div>
                      <label htmlFor={`item-${item.id}-path`} className="block text-xs text-gray-500 mb-1">Yo'l / Путь</label>
                      <input
                        id={`item-${item.id}-path`}
                        type="text"
                        value={item.path}
                        onChange={(e) => updateItem(item.id, 'path', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1 pt-1">
                    <button
                      onClick={() => toggleVisibility(item)}
                      className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      aria-label={item.is_visible ? `${item.label_uz} ni yashirish` : `${item.label_uz} ni ko'rsatish`}
                      title={item.is_visible ? 'Yashirish / Скрыть' : 'Ko\'rsatish / Показать'}
                    >
                      {item.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <button
                      onClick={() => handleUpdate(item)}
                      disabled={saving}
                      className="p-2 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      aria-label={`${item.label_uz} ni saqlash`}
                      title="Saqlash / Сохранить"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                      aria-label={`${item.label_uz} ni o'chirish`}
                      title="O'chirish / Удалить"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {pages.length > 0 && (
                  <div className="mt-2 ml-10">
                    <label htmlFor={`item-${item.id}-page`} className="block text-xs text-gray-500 mb-1">Sahifa bog'lash / Привязка к странице</label>
                    <select
                      id={`item-${item.id}-page`}
                      value={item.page_id || ''}
                      onChange={(e) => updateItem(item.id, 'page_id', e.target.value ? Number(e.target.value) : null)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                    >
                      <option value="">-- Tanlang --</option>
                      {pages.map(p => (
                        <option key={p.id} value={p.id}>{p.title_uz} / {p.title_ru}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
