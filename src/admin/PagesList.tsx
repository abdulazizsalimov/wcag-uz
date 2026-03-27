import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { pagesApi, type Page } from './api';
import AdminLayout from './AdminLayout';
import { Plus, Edit, Trash2, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

export default function PagesList() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadPages = async () => {
    try {
      const data = await pagesApi.list();
      setPages(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: 'Sahifalarni yuklashda xatolik' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPages(); }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`"${title}" sahifasini o'chirishni tasdiqlaysizmi?`)) return;
    try {
      await pagesApi.delete(id);
      await loadPages();
      setMessage({ type: 'success', text: 'Sahifa o\'chirildi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'O\'chirishda xatolik' });
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sahifalar</h1>
            <p className="text-gray-500">Sayt sahifalarini boshqarish / Управление страницами сайта</p>
          </div>
          <button
            onClick={() => navigate('/admin/pages/new')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Plus size={18} aria-hidden="true" />
            Yangi sahifa
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

        {pages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 mb-4">Sahifalar yo'q / Нет страниц</p>
            <button
              onClick={() => navigate('/admin/pages/new')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Plus size={18} aria-hidden="true" />
              Birinchi sahifani yarating
            </button>
          </div>
        ) : (
          <div className="space-y-2" role="list" aria-label="Sahifalar ro'yxati">
            {pages.map((page) => (
              <div
                key={page.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                role="listitem"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-gray-900 truncate">{page.title_uz}</h2>
                      {!page.is_published && (
                        <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
                          <EyeOff size={12} aria-hidden="true" />
                          Qoralama
                        </span>
                      )}
                      {page.is_published && (
                        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                          <Eye size={12} aria-hidden="true" />
                          Chop etilgan
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{page.title_ru}</p>
                    <p className="text-xs text-gray-400 mt-1">/{page.slug}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <Link
                      to={`/admin/pages/${page.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      aria-label={`${page.title_uz} ni tahrirlash`}
                      title="Tahrirlash / Редактировать"
                    >
                      <Edit size={18} />
                    </Link>
                    <a
                      href={`/page/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      aria-label={`${page.title_uz} ni ko'rish`}
                      title="Ko'rish / Просмотр"
                    >
                      <Eye size={18} />
                    </a>
                    <button
                      onClick={() => handleDelete(page.id, page.title_uz)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                      aria-label={`${page.title_uz} ni o'chirish`}
                      title="O'chirish / Удалить"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
