import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-6">
          {/* 404 Illustration */}
          <div className="relative">
            <div className="text-8xl md:text-9xl font-bold text-slate-200 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-blue-600" />
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardContent className="p-8 space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                找不到頁面
              </h1>
              <p className="text-slate-600 leading-relaxed">
                抱歉，您要尋找的頁面不存在。可能是網址輸入錯誤，或是頁面已經移動到其他位置。
              </p>
              
              <div className="space-y-3 pt-4">
                <p className="text-sm text-slate-500">您可以嘗試：</p>
                <ul className="text-sm text-slate-600 text-left space-y-1">
                  <li>• 檢查網址是否正確</li>
                  <li>• 返回首頁重新導覽</li>
                  <li>• 使用導覽列尋找內容</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Home")}>
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl shadow-lg">
                <Home className="w-4 h-4 mr-2" />
                返回首頁
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-8 py-3 rounded-xl border-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回上頁
            </Button>
          </div>
          
          {/* Help Text */}
          <div className="text-center pt-4">
            <p className="text-sm text-slate-500">
              如果問題持續發生，請聯絡系統管理員
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}