import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import LoginModal from "./LoginModal";

export default function AdminProtection({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const loginStatus = localStorage.getItem('isAdminLoggedIn');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (loginStatus === 'true' && loginTime) {
      // 檢查登入是否過期 (24小時)
      const now = Date.now();
      const loginTimestamp = parseInt(loginTime);
      const expirationTime = 24 * 60 * 60 * 1000; // 24小時
      
      if (now - loginTimestamp < expirationTime) {
        setIsLoggedIn(true);
      } else {
        // 登入過期，清除狀態
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('adminLoginTime');
        setIsLoggedIn(false);
      }
    }
    
    setIsLoading(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">驗證中...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-md w-full">
          <Card className="border-0 shadow-xl rounded-3xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-10 h-10 text-blue-600" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-900">管理系統</h1>
                <p className="text-slate-600">
                  需要管理員權限才能訪問此頁面
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowLoginModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl"
                  size="lg"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  管理員登入
                </Button>
                
                <Link to={createPageUrl("Home")}>
                  <Button 
                    variant="outline" 
                    className="w-full py-3 rounded-xl"
                    size="lg"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    返回首頁
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  // 為已登入的管理員添加登出功能
  return (
    <div>
      <div className="bg-blue-600 text-white px-4 py-2 text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>管理員模式</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-white hover:bg-blue-700 rounded-lg"
          >
            登出
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}