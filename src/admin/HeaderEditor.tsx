import { useState, useEffect, FormEvent } from 'react';
import { settingsApi } from './api';
import BilingualInput from './BilingualInput';
import AdminLayout from './AdminLayout';
import { Save, Check, AlertCircle } from 'lucide-react';

export default function HeaderEditor() {
  const [logoUrl, setLogoUrl] = useState({ uz: '', ru: '' });
  const [siteName, setSiteName] = useState({ uz: '', ru: '' });
  const [siteDescription, setSiteDescription] = useState({ uz: '', ru: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    settingsApi.get().then(data => {
      if (data.logo_url) setLogoUrl(data.logo_url);
      if (data.site_name) setSiteName(data.site_name);
      if (data.site_description) setSiteDescription(data.site_description);
    }).catch(() => {
      setMessage({ type: 'error', text: 'Ma\'lumotlarni yuklashda xatolik' });
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await settingsApi.update({
        logo_url: logoUrl,
        site_name: siteName,
        site_description: siteDescription,
      });
      setMessage({ type: 'success', text: 'Saqlandi! / Сохранено!' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'Saqlashda xatolik / Ошибка сохранения' });
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
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Sarlavhani tahrirlash</h1>
        <p className="text-gray-500 mb-6">Sayt sarlavhasini sozlash / Настройка шапки сайта</p>

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

        <form onSubmit={handleSave} className="space-y-6 bg-white rounded-xl border border-gray-200 p-6">
          <BilingualInput
            id="site-name"
            labelUz="Sayt nomi"
            labelRu="Название сайта"
            valueUz={siteName.uz}
            valueRu={siteName.ru}
            onChangeUz={(v) => setSiteName(prev => ({ ...prev, uz: v }))}
            onChangeRu={(v) => setSiteName(prev => ({ ...prev, ru: v }))}
            required
          />

          <BilingualInput
            id="site-desc"
            labelUz="Sayt tavsifi"
            labelRu="Описание сайта"
            valueUz={siteDescription.uz}
            valueRu={siteDescription.ru}
            onChangeUz={(v) => setSiteDescription(prev => ({ ...prev, uz: v }))}
            onChangeRu={(v) => setSiteDescription(prev => ({ ...prev, ru: v }))}
            multiline
          />

          <BilingualInput
            id="logo-url"
            labelUz="Logotip URL"
            labelRu="URL логотипа"
            valueUz={logoUrl.uz}
            valueRu={logoUrl.ru}
            onChangeUz={(v) => setLogoUrl(prev => ({ ...prev, uz: v }))}
            onChangeRu={(v) => setLogoUrl(prev => ({ ...prev, ru: v }))}
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
      </div>
    </AdminLayout>
  );
}
