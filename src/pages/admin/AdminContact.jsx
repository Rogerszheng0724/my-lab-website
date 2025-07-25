import React, { useState, useEffect } from "react";
import { Contact } from "@/entities/all";
import AdminProtection from "@/components/admin/AdminProtection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Save } from "lucide-react";

function AdminContactContent() {
  const [contact, setContact] = useState(null);
  const [formData, setFormData] = useState({ lab_name: '', department: '', university: '', address: '', phone: '', fax: '', email: '', website: '', latitude: '', longitude: '', office_hours: '' });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await Contact.list();
    if (data.length > 0) {
      setContact(data[0]);
      setFormData(data[0]);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = {...formData, latitude: parseFloat(formData.latitude) || null, longitude: parseFloat(formData.longitude) || null};
    if (contact) {
      await Contact.update(contact.id, payload);
    } else {
      await Contact.create(payload);
    }
    setIsSaving(false);
    loadData();
    alert('資訊已儲存！');
  };

  if (loading) return <div>載入中...</div>;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2 mb-8"><MapPin />聯絡資訊管理</h1>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader><CardTitle>編輯實驗室聯絡資訊</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="lab_name">實驗室名稱</Label><Input id="lab_name" name="lab_name" value={formData.lab_name} onChange={handleChange} required /></div>
                <div><Label htmlFor="department">系所</Label><Input id="department" name="department" value={formData.department} onChange={handleChange} /></div>
                <div><Label htmlFor="university">學校名稱</Label><Input id="university" name="university" value={formData.university} onChange={handleChange} /></div>
                <div><Label htmlFor="address">地址</Label><Input id="address" name="address" value={formData.address} onChange={handleChange} required /></div>
                <div><Label htmlFor="phone">電話</Label><Input id="phone" name="phone" value={formData.phone} onChange={handleChange} /></div>
                <div><Label htmlFor="fax">傳真</Label><Input id="fax" name="fax" value={formData.fax} onChange={handleChange} /></div>
                <div><Label htmlFor="email">電子郵件</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} /></div>
                <div><Label htmlFor="website">網站</Label><Input id="website" name="website" value={formData.website} onChange={handleChange} /></div>
                <div><Label htmlFor="latitude">緯度</Label><Input id="latitude" name="latitude" type="number" step="any" value={formData.latitude || ''} onChange={handleChange} /></div>
                <div><Label htmlFor="longitude">經度</Label><Input id="longitude" name="longitude" type="number" step="any" value={formData.longitude || ''} onChange={handleChange} /></div>
                <div className="md:col-span-2"><Label htmlFor="office_hours">辦公時間</Label><Input id="office_hours" name="office_hours" value={formData.office_hours} onChange={handleChange} /></div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" /> {isSaving ? '儲存中...' : '儲存變更'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default function AdminContact() {
  return <AdminProtection><AdminContactContent /></AdminProtection>;
}