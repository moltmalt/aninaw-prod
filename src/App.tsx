import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

// Layouts
import { PublicLayout } from '@/components/layout/PublicLayout';
import AdminLayout from '@/components/layout/AdminLayout';

// Public pages
import HomePage from '@/pages/public/HomePage';
import StoriesPage from '@/pages/public/StoriesPage';
import StoryDetailPage from '@/pages/public/StoryDetailPage';
import CategoryPage from '@/pages/public/CategoryPage';
import TagPage from '@/pages/public/TagPage';
import AuthorPage from '@/pages/public/AuthorPage';
import SeriesPage from '@/pages/public/SeriesPage';
import SearchPage from '@/pages/public/SearchPage';
import ArchivePage from '@/pages/public/ArchivePage';
import AboutPage from '@/pages/public/AboutPage';
import ContactPage from '@/pages/public/ContactPage';

// Admin pages
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminStoriesPage from '@/pages/admin/AdminStoriesPage';
import AdminStoryNewPage from '@/pages/admin/AdminStoryNewPage';
import AdminStoryEditPage from '@/pages/admin/AdminStoryEditPage';
import AdminMediaPage from '@/pages/admin/AdminMediaPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';

function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public routes ── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/story/:slug" element={<StoryDetailPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/tag/:slug" element={<TagPage />} />
          <Route path="/author/:slug" element={<AuthorPage />} />
          <Route path="/series/:slug" element={<SeriesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* ── Admin routes ── */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/stories" element={<AdminStoriesPage />} />
          <Route path="/admin/stories/new" element={<AdminStoryNewPage />} />
          <Route path="/admin/stories/:id/edit" element={<AdminStoryEditPage />} />
          <Route path="/admin/media" element={<AdminMediaPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
