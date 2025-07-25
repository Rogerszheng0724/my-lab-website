import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Home, 
  Users, 
  FileText, 
  Microscope, 
  BookOpen, 
  Trophy, 
  Image, 
  MapPin, 
  Settings,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginModal from "../components/admin/LoginModal";

const publicNavigation = [
  { title: "首頁", url: createPageUrl("Home"), icon: Home },
  { title: "成員", url: createPageUrl("Members"), icon: Users },
  { title: "研究", url: createPageUrl("Research"), icon: Microscope },
  { title: "著作", url: createPageUrl("Publications"), icon: FileText },
  { title: "課程", url: createPageUrl("Courses"), icon: BookOpen },
  { title: "獲獎", url: createPageUrl("Awards"), icon: Trophy },
  { title: "相簿", url: createPageUrl("Gallery"), icon: Image },
  { title: "聯絡", url: createPageUrl("Contact"), icon: MapPin }
];

const adminNavigation = [
  { title: "管理首頁", url: createPageUrl("Admin"), icon: Settings },
  { title: "成員管理", url: createPageUrl("AdminMembers"), icon: Users },
  { title: "研究管理", url: createPageUrl("AdminResearch"), icon: Microscope },
  { title: "著作管理", url: createPageUrl("AdminPublications"), icon: FileText },
  { title: "課程管理", url: createPageUrl("AdminCourses"), icon: BookOpen },
  { title: "獲獎管理", url: createPageUrl("AdminAwards"), icon: Trophy },
  { title: "相簿管理", url: createPageUrl("AdminGallery"), icon: Image },
  { title: "聯絡管理", url: createPageUrl("AdminContact"), icon: MapPin }
];

export default function Layout({ currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState(false);
  
  const isAdminPage = currentPageName?.startsWith('Admin');
  const navigation = isAdminPage ? adminNavigation : publicNavigation;

  React.useEffect(() => {
    // 檢查管理員登入狀態
    const checkAdminStatus = () => {
      const loginStatus = localStorage.getItem('isAdminLoggedIn');
      const loginTime = localStorage.getItem('adminLoginTime');
      
      if (loginStatus === 'true' && loginTime) {
        const now = Date.now();
        const loginTimestamp = parseInt(loginTime);
        const expirationTime = 24 * 60 * 60 * 1000; // 24小時
        
        if (now - loginTimestamp < expirationTime) {
          setIsAdminLoggedIn(true);
        } else {
          localStorage.removeItem('isAdminLoggedIn');
          localStorage.removeItem('adminLoginTime');
          setIsAdminLoggedIn(false);
        }
      }
    };

    checkAdminStatus();
  }, []);

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    // 導向管理首頁
    window.location.href = createPageUrl("Admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <style>
        {`
          :root {
            --primary: 30 58 138;
            --primary-foreground: 248 250 252;
            --secondary: 100 116 139;
            --accent: 59 130 246;
          }
        `}
      </style>
      
      {/* Navigation Header */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl(isAdminPage ? "Admin" : "Home")} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <Microscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">柯柯資科LAB</h1>
                {isAdminPage && <p className="text-xs text-blue-600">管理系統</p>}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 text-sm font-medium ${
                    location.pathname === item.url
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
              
              {/* Admin Settings Icon (只在非管理頁面顯示) */}
              {!isAdminPage && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (isAdminLoggedIn) {
                      window.location.href = createPageUrl("Admin");
                    } else {
                      setShowLoginModal(true);
                    }
                  }}
                  className="ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
                  title="管理系統"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              {!isAdminPage && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (isAdminLoggedIn) {
                      window.location.href = createPageUrl("Admin");
                    } else {
                      setShowLoginModal(true);
                    }
                  }}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`block px-3 py-2 rounded-xl text-base font-medium transition-colors ${
                    location.pathname === item.url
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="flex-1">
       <Outlet />
      </main>

      {/* Footer */}
      {!isAdminPage && (
        <footer className="bg-slate-800 text-white py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Microscope className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">柯柯實驗室</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  致力於學術研究與人才培育，推動科學技術發展與創新。
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-4 text-slate-200">快速連結</h4>
                <ul className="space-y-2">
                  {publicNavigation.slice(0, 4).map((item) => (
                    <li key={item.title}>
                      <Link 
                        to={item.url} 
                        className="text-slate-300 hover:text-white transition-colors text-sm"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-4 text-slate-200">聯絡資訊</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>電子信箱：info@lab.edu.tw</p>
                  <p>聯絡電話：(02) 1234-5678</p>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (isAdminLoggedIn) {
                        window.location.href = createPageUrl("Admin");
                      } else {
                        setShowLoginModal(true);
                      }
                    }}
                    className="text-blue-400 hover:text-blue-300 transition-colors p-0 h-auto"
                  >
                    管理系統 →
                  </Button>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-700 pt-8 mt-8 text-center">
              <p className="text-slate-400 text-sm">
                © 2024-2025 柯柯實驗室. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleAdminLogin}
      />
    </div>
  );
}