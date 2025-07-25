import React, { useState, useEffect } from "react";
import { Award } from "@/entities/all";
import AdminProtection from "@/components/admin/AdminProtection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Plus, Edit, Trash2 } from "lucide-react";

const AwardForm = ({ item, onSubmit }) => {
  const [formData, setFormData] = useState(item || { title: '', recipient: '', organization: '', year: '', description: '', category: '學術獎項', certificate_url: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label htmlFor="title">獎項名稱</Label><Input id="title" name="title" value={formData.title} onChange={handleChange} required /></div>
        <div><Label htmlFor="recipient">得獎人</Label><Input id="recipient" name="recipient" value={formData.recipient} onChange={handleChange} required /></div>
        <div><Label htmlFor="organization">頒獎機構</Label><Input id="organization" name="organization" value={formData.organization} onChange={handleChange} /></div>
        <div><Label htmlFor="year">年份</Label><Input id="year" name="year" type="number" value={formData.year || ''} onChange={handleChange} required /></div>
      </div>
      <div><Label>類別</Label><Select name="category" value={formData.category} onValueChange={(v) => handleSelectChange('category', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="學術獎項">學術獎項</SelectItem><SelectItem value="教學獎項">教學獎項</SelectItem><SelectItem value="服務獎項">服務獎項</SelectItem><SelectItem value="學生獎項">學生獎項</SelectItem></SelectContent></Select></div>
      <div><Label htmlFor="certificate_url">獎狀圖片網址</Label><Input id="certificate_url" name="certificate_url" value={formData.certificate_url} onChange={handleChange} /></div>
      <div><Label htmlFor="description">描述</Label><Textarea id="description" name="description" value={formData.description} onChange={handleChange} /></div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">取消</Button></DialogClose>
        <Button type="submit">{item ? '更新' : '新增'}</Button>
      </DialogFooter>
    </form>
  );
};

function AdminAwardsContent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await Award.list();
    setItems(data);
    setLoading(false);
  };

  const handleSubmit = async (data) => {
    const payload = {...data, year: parseInt(data.year, 10)};
    if (editingItem) {
      await Award.update(editingItem.id, payload);
    } else {
      await Award.create(payload);
    }
    setShowForm(false);
    setEditingItem(null);
    loadData();
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    await Award.delete(itemToDelete.id);
    setItemToDelete(null);
    loadData();
  };

  if (loading) return <div>載入中...</div>;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2"><Trophy />獲獎管理</h1>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild><Button onClick={() => setEditingItem(null)}><Plus className="mr-2 h-4 w-4" /> 新增獎項</Button></DialogTrigger>
            <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>{editingItem ? "編輯獎項" : "新增獎項"}</DialogTitle></DialogHeader><AwardForm item={editingItem} onSubmit={handleSubmit} /></DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardHeader><CardTitle>獲獎列表</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div><p className="font-semibold">{item.title}</p><p className="text-sm text-slate-500">{item.recipient} ({item.year})</p></div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => { setEditingItem(item); setShowForm(true); }}><Edit className="mr-2 h-4 w-4"/>編輯</Button>
                  <Button variant="destructive" size="sm" onClick={() => setItemToDelete(item)}><Trash2 className="mr-2 h-4 w-4"/>刪除</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
          <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>確定要刪除嗎？</AlertDialogTitle><AlertDialogDescription>此操作無法復原。</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>取消</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>確定刪除</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default function AdminAwards() {
  return <AdminProtection><AdminAwardsContent /></AdminProtection>;
}