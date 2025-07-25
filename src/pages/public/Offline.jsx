import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WifiOff, RefreshCw, Smartphone } from "lucide-react";

export default function Offline() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-6">
          {/* Offline Illustration */}
          <div className="relative">
            <div className="w-32 h-32 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
              <WifiOff className="w-16 h-16 text-slate-400" />
            </div>
            <div className="absolute -bottom-2 -right-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardContent className="p-8 space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                網路連線中斷
              </h1>
              <p className="text-slate-600 leading-relaxed">
                目前無法連接到網際網路。請檢查您的網路連線設定，然後再試一次。
              </p>
              
              <div className="space-y-3 pt-4">
                <p className="text-sm text-slate-500">檢查項目：</p>
                <ul className="text-sm text-slate-600 text-left space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    WiFi 或行動網路是否已開啟
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    是否在訊號覆蓋範圍內
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    其他應用程式能否正常連網
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              onClick={handleRefresh}
              className="w-full bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl shadow-lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              重新載入頁面
            </Button>
            
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span>或</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 text-sm">
                  <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-medium text-blue-900">行動網路使用者</p>
                    <p className="text-blue-700">請確認數據流量是否充足</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Status */}
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>連線狀態：離線</span>
          </div>
        </div>
      </div>
    </div>
  );
}