import React, { useState, useEffect } from "react";
import { Contact } from "@/entities/all";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Globe, Clock, Building } from "lucide-react";

export default function ContactPage() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContact();
  }, []);

  const loadContact = async () => {
    try {
      const contactData = await Contact.list();
      setContact(contactData[0]);
    } catch (error) {
      console.error('載入聯絡資訊時發生錯誤:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">載入中...</p>
        </div>
      </div>
    );
  }

  const mapUrl = contact?.latitude && contact?.longitude 
    ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO_i8vn7FOCbhg&q=${contact.latitude},${contact.longitude}&zoom=16`
    : null;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">聯絡資訊</h1>
          <p className="text-xl text-slate-600">歡迎與我們聯繫</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {contact ? (
              <>
                <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {contact.lab_name || '實驗室'}
                    </h2>
                    <p className="text-blue-100">
                      {contact.department && `${contact.department} | `}
                      {contact.university}
                    </p>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    {contact.address && (
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">地址</h3>
                          <p className="text-slate-600 leading-relaxed">{contact.address}</p>
                        </div>
                      </div>
                    )}

                    {contact.phone && (
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Phone className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">電話</h3>
                          <a 
                            href={`tel:${contact.phone}`}
                            className="text-slate-600 hover:text-green-600 transition-colors"
                          >
                            {contact.phone}
                          </a>
                          {contact.fax && (
                            <p className="text-slate-500 text-sm mt-1">傳真：{contact.fax}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {contact.email && (
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Mail className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">電子郵件</h3>
                          <a 
                            href={`mailto:${contact.email}`}
                            className="text-slate-600 hover:text-red-600 transition-colors"
                          >
                            {contact.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {contact.website && (
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Globe className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">網站</h3>
                          <a 
                            href={contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-600 hover:text-purple-600 transition-colors"
                          >
                            {contact.website}
                          </a>
                        </div>
                      </div>
                    )}

                    {contact.office_hours && (
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">辦公時間</h3>
                          <p className="text-slate-600">{contact.office_hours}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Additional Info Card */}
                <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Building className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-slate-900">參訪資訊</h3>
                    </div>
                    <div className="space-y-3 text-sm text-slate-600">
                      <p>• 請事先透過電話或電子郵件聯繫</p>
                      <p>• 學術合作與交流歡迎洽詢</p>
                      <p>• 研究生招生資訊請參考學校網站</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardContent className="p-12 text-center">
                  <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">暫無聯絡資訊</h3>
                  <p className="text-slate-600">聯絡資訊尚未建立，請稍後再試。</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Map */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <div className="bg-slate-800 p-4">
                <h3 className="text-white font-semibold">實驗室位置</h3>
              </div>
              <CardContent className="p-0">
                {mapUrl ? (
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full"
                  ></iframe>
                ) : (
                  <div className="h-96 bg-slate-100 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">地圖資訊暫未提供</p>
                      <p className="text-slate-400 text-sm mt-2">
                        請使用上方地址資訊進行導航
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transportation Info */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">交通資訊</h3>
                <div className="space-y-4 text-sm text-slate-600">
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">🚇 大眾運輸</h4>
                    <p>可以搭乘火車、高鐵後轉公車前往</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">🚗 開車前來</h4>
                    <p>校內設有訪客停車場</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">🚌 公車路線</h4>
                    <p>多條公車路線可達，建議查詢即時交通資訊</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}