import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authApi } from './api';
import {
  LayoutDashboard, FileText, Menu, Settings, LogOut,
  ChevronLeft, ChevronRight, Globe
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', labelRu: 'Панель управления' },
  { path: '/admin/pages', icon: FileText, label: 'Sahifalar', labelRu: 'Страницы' },
  { path: '/admin/menu', icon: Menu, label: 'Menyu', labelRu: 'Меню' },
  { path: '/admin/header', icon: Globe, label: 'Sarlavha', labelRu: 'Шапка' },
  { path: '/admin/footer', icon: Settings, label: 'Pastki qism', labelRu: 'Подвал' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    authApi.check().catch(() => {
      navigate('/admin');
    }).finally(() => setChecking(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" role="status">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="sr-only">Yuklanmoqda...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <nav
        className={`${collapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-200`}
        aria-label="Admin navigatsiya"
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!collapsed && (
            <Link to="/admin" className="font-bold text-lg text-blue-700">
              WCAG.uz Admin
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={collapsed ? 'Menyuni yoyish' : 'Menyuni yig\'ish'}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <ul className="flex-1 py-2" role="list">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                    focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500`}
                  aria-current={isActive ? 'page' : undefined}
                  title={item.label}
                >
                  <item.icon size={20} aria-hidden="true" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="border-t border-gray-200 p-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <LogOut size={20} aria-hidden="true" />
            {!collapsed && <span>Chiqish</span>}
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-auto" id="admin-main" tabIndex={-1}>
        <div className="max-w-6xl mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
