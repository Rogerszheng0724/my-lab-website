// src/App.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// 共用版面
import Layout from './pages/Layout';

// 公開頁面
import Home from './pages/public/Home';
import Members from './pages/public/Members';
import Research from './pages/public/Research';
import Publications from './pages/public/Publications';
import Courses from './pages/public/Courses';
import Awards from './pages/public/Awards';
import Gallery from './pages/public/Gallery';
import Contact from './pages/public/Contact';

// 管理後台頁面
import Admin from './pages/admin/Admin';
import AdminMembers from './pages/admin/AdminMembers';
import AdminResearch from './pages/admin/AdminResearch';
import AdminPublications from './pages/admin/AdminPublications';
import AdminCourses from './pages/admin/AdminCourses';
import AdminAwards from './pages/admin/AdminAwards';
import AdminGallery from './pages/admin/AdminGallery';
import AdminContact from './pages/admin/AdminContact';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // 所有公開頁面都使用這個版面
    children: [
      { index: true, element: <Home /> },
      { path: 'members', element: <Members /> },
      { path: 'research', element: <Research /> },
      { path: 'publications', element: <Publications /> },
      { path: 'courses', element: <Courses /> },
      { path: 'awards', element: <Awards /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'contact', element: <Contact /> },
    ],
  },
  {
    path: '/admin', // 所有管理頁面的路徑都以 /admin 開頭
    children: [
      { index: true, element: <Admin /> },
      { path: 'members', element: <AdminMembers /> },
      { path: 'research', element: <AdminResearch /> },
      { path: 'publications', element: <AdminPublications /> },
      { path: 'courses', element: <AdminCourses /> },
      { path: 'awards', element: <AdminAwards /> },
      { path: 'gallery', element: <AdminGallery /> },
      { path: 'contact', element: <AdminContact /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}