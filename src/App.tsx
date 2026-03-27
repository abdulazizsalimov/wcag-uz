import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Designers from './pages/Designers';
import Developers from './pages/Developers';
import ContentManagers from './pages/ContentManagers';
import Resources from './pages/Resources';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import WcagGuide from './pages/WcagGuide';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import HeaderEditor from './admin/HeaderEditor';
import MenuEditor from './admin/MenuEditor';
import FooterEditor from './admin/FooterEditor';
import PagesList from './admin/PagesList';
import PageEditor from './admin/PageEditor';
import DynamicPage from './admin/DynamicPage';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/designers" element={<Designers />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/content-managers" element={<ContentManagers />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wcag-guide" element={<WcagGuide />} />
          <Route path="/page/:slug" element={<DynamicPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Admin routes - no header/footer */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/header" element={<HeaderEditor />} />
        <Route path="/admin/menu" element={<MenuEditor />} />
        <Route path="/admin/footer" element={<FooterEditor />} />
        <Route path="/admin/pages" element={<PagesList />} />
        <Route path="/admin/pages/:id" element={<PageEditor />} />
        {/* Public routes */}
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}
