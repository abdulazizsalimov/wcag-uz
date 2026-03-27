import { useState, useEffect, FormEvent } from 'react';
import { footerApi } from './api';
import BilingualInput from './BilingualInput';
import AdminLayout from './AdminLayout';
import { Save, Check, AlertCircle, Plus, Trash2 } from 'lucide-react';

interface FooterLink {
  id: number;
  label_uz: string;
  label_ru: string;
  url: string;
  column_index: number;
  order_index: number;
}

export default function FooterEditor() {
  const [description, setDescription] = useState({ uz: '', ru: '' });
  const [copyright, setCopyright] = useState({ uz: '', ru: '' });
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newLink, setNewLink] = useState({ label_uz: '', label_ru: '', url: '', column_index: 0 });
  const [showAddLink, setShowAddLink] = useState(false);

  const loadData = async () => {
    try {
      const data = await footerApi.get();
      if (data.settings) {
        if (data.settings.description) setDescription(data.settings.description);
        if (data.settings.copyright) setCopyright(data.settings.copyright);
      }
      if (data.links) setLinks(data.links);
    } catch {
      setMessage({ type: 'error', text: 'Ma\'lumotlarni yuklashda xatolik' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await footerApi.updateSettings({ description, copyright });
      setMessage({ type: 'success', text: 'Saqlandi! / Сохранено!' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'Saqlashda xatolik / Ошибка сохранения' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddLink = async () => {
    if (!newLink.label_uz || !newLink.url) return;
    setSaving(true);
    try {
      await footerApi.createLink({
        label_uz: newLink.label_uz,
        label_ru: newLink.label_ru,
        url: newLink.url,
        column_index: newLink.column_index,
        order_index: links.filter(l => l.column_index === newLink.column_index).length,
      });
      setNewLink({ label_uz: '', label_ru: '', url: '', column_index: 0 });
      setShowAddLink(false);
      await loadData();
      setMessage({ type: 'success', text: 'Havola qo\'shildi' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'Qo\'shishda xatolik' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateLink = async (link: FooterLink) => {
    setSaving(true);
    try {
      await footerApi.updateLink(link.id, {
        label_uz: link.label_uz,
        label_ru: link.label_ru,
        url: link.url,
        column_index: link.column_index,
        order_index: link.order_index,
      });
      setMessage({ type: 'success', text: 'Saqlandi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'Saqlashda xatolik' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLink = async (id: number) => {
    if (!confirm('O\'chirishni tasdiqlaysizmi?')) return;
    try {
      await footerApi.deleteLink(id);
      await loadData();
      setMessage({ type: 'success', text: 'O\'chirildi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'O\'chirishda xatolik' });
    }
  };

  const updateLink = (id: number, field: keyof FooterLink, value: string | number) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
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
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Pastki qismni tahrirlash</h1>
        <p className="text-gray-500 mb-6">Sayt pastki qismini sozlash / Настройка подвала сайта</p>

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

        {/* Footer Settings */}
        <form onSubmit={handleSaveSettings} className="space-y-6 bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Asosiy sozlamalar / Основные настройки</h2>

          <BilingualInput
            id="footer-desc"
            labelUz="Tavsif"
            labelRu="Описание"
            valueUz={description.uz}
            valueRu={description.ru}
            onChangeUz={(v) => setDescription(prev => ({ ...prev, uz: v }))}
            onChangeRu={(v) => setDescription(prev => ({ ...prev, ru: v }))}
            multiline
          />

          <BilingualInput
            id="footer-copy"
            labelUz="Mualliflik huquqi"
            labelRu="Авторские права"
            valueUz={copyright.uz}
            valueRu={copyright.ru}
            onChangeUz={(v) => setCopyright(prev => ({ ...prev, uz: v }))}
            onChangeRu={(v) => setCopyright(prev => ({ ...prev, ru: v }))}
          />

          <div className="flex justify-end">
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

        {/* Footer Links */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Havolalar / Ссылки</h2>
            <button
              onClick={() => setShowAddLink(!showAddLink)}
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Plus size={16} aria-hidden="true" />
              Qo'shish
            </button>
          </div>

          {showAddLink && (
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-gray-900 mb-3">Yangi havola / Новая ссылка</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="new-link-uz" className="block text-sm text-gray-700 mb-1">Nomi (O'zbekcha)</label>
                  <input
                    id="new-link-uz"
                    type="text"
                    value={newLink.label_uz}
                    onChange={(e) => setNewLink(prev => ({ ...prev, label_uz: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="new-link-ru" className="block text-sm text-gray-700 mb-1">Название (Русский)</label>
                  <input
                    id="new-link-ru"
                    type="text"
                    value={newLink.label_ru}
                    onChange={(e) => setNewLink(prev => ({ ...prev, label_ru: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="new-link-url" className="block text-sm text-gray-700 mb-1">URL</label>
                  <input
                    id="new-link-url"
                    type="text"
                    value={newLink.url}
                    onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    placeholder="/page or https://..."
                  />
                </div>
                <div>
                  <label htmlFor="new-link-col" className="block text-sm text-gray-700 mb-1">Ustun / Колонка</label>
                  <select
                    id="new-link-col"
                    value={newLink.column_index}
                    onChange={(e) => setNewLink(prev => ({ ...prev, column_index: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                  >
                    <option value={0}>1-ustun</option>
                    <option value={1}>2-ustun</option>
                    <option value={2}>3-ustun</option>
                  </select>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleAddLink}
                  disabled={saving || !newLink.label_uz || !newLink.url}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  Qo'shish / Добавить
                </button>
                <button
                  onClick={() => setShowAddLink(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2" role="list" aria-label="Footer havolalari">
            {links.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Havolalar yo'q / Нет ссылок</p>
            ) : (
              links.map((link) => (
                <div key={link.id} className="border border-gray-200 rounded-lg p-3" role="listitem">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                    <div>
                      <label htmlFor={`link-${link.id}-uz`} className="block text-xs text-gray-500 mb-1">O'zbekcha</label>
                      <input
                        id={`link-${link.id}-uz`}
                        type="text"
                        value={link.label_uz}
                        onChange={(e) => updateLink(link.id, 'label_uz', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label htmlFor={`link-${link.id}-ru`} className="block text-xs text-gray-500 mb-1">Русский</label>
                      <input
                        id={`link-${link.id}-ru`}
                        type="text"
                        value={link.label_ru}
                        onChange={(e) => updateLink(link.id, 'label_ru', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label htmlFor={`link-${link.id}-url`} className="block text-xs text-gray-500 mb-1">URL</label>
                      <input
                        id={`link-${link.id}-url`}
                        type="text"
                        value={link.url}
                        onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label htmlFor={`link-${link.id}-col`} className="block text-xs text-gray-500 mb-1">Ustun</label>
                      <select
                        id={`link-${link.id}-col`}
                        value={link.column_index}
                        onChange={(e) => updateLink(link.id, 'column_index', Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                      >
                        <option value={0}>1-ustun</option>
                        <option value={1}>2-ustun</option>
                        <option value={2}>3-ustun</option>
                      </select>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleUpdateLink(link)}
                        disabled={saving}
                        className="p-2 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        aria-label={`${link.label_uz} ni saqlash`}
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-2 text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                        aria-label={`${link.label_uz} ni o'chirish`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
