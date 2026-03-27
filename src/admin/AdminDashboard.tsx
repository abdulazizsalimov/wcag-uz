import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pagesApi, menuApi } from './api';
import { FileText, Menu, Globe, Settings, ArrowRight } from 'lucide-react';
import AdminLayout from './AdminLayout';

export default function AdminDashboard() {
  const [pageCount, setPageCount] = useState(0);
  const [menuCount, setMenuCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      pagesApi.list().catch(() => []),
      menuApi.list().catch(() => []),
    ]).then(([pages, menu]) => {
      setPageCount(Array.isArray(pages) ? pages.length : 0);
      setMenuCount(Array.isArray(menu) ? menu.length : 0);
      setLoading(false);
    });
  }, []);

  const cards = [
    { title: 'Sahifalar', titleRu: 'Страницы', count: pageCount, icon: FileText, path: '/admin/pages', color: 'blue' },
    { title: 'Menyu', titleRu: 'Меню', count: menuCount, icon: Menu, path: '/admin/menu', color: 'green' },
    { title: 'Sarlavha', titleRu: 'Шапка', icon: Globe, path: '/admin/header', color: 'purple' },
    { title: 'Pastki qism', titleRu: 'Подвал', icon: Settings, path: '/admin/footer', color: 'orange' },
  ];

  const colorClasses: Record<string, { bg: string; text: string; icon: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-600' },
    green: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-600' },
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Boshqaruv paneli
        </h1>
        <p className="text-gray-500 mb-8">Sayt kontentini boshqarish / Управление контентом сайта</p>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-500" role="status">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
            <span>Yuklanmoqda...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => {
              const colors = colorClasses[card.color];
              return (
                <Link
                  key={card.path}
                  to={card.path}
                  className={`${colors.bg} rounded-xl p-6 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <card.icon size={24} className={colors.icon} aria-hidden="true" />
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" aria-hidden="true" />
                  </div>
                  <h2 className={`font-semibold ${colors.text}`}>{card.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{card.titleRu}</p>
                  {card.count !== undefined && (
                    <p className={`text-2xl font-bold mt-2 ${colors.text}`}>{card.count}</p>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-2">Tezkor havolalar / Быстрые ссылки</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Saytni ko'rish / Просмотр сайта
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
