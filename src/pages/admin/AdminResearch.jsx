import React, { useState, useEffect } from "react";
import { Research } from "@/entities/all";
import AdminProtection from "@/components/admin/AdminProtection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Microscope, Plus, Edit, Trash2 } from "lucide-react";

const ResearchForm = ({ item, onSubmit }) => {
  const [formData, setFormData] = useState(item || { title: '', description: '', type: '研究方向', status: '進行中', start_year: '', end_year: '', funding_source: '', budget: '', participants: '', image_url: '', keywords: '' });

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
        <div><Label htmlFor="title">標題</Label><Input id="title" name="title" value={formData.title} onChange={handleChange} required /></div>
        <div><Label>類型</Label><Select name="type" value={formData.type} onValueChange={(v) => handleSelectChange('type', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="研究方向">研究方向</SelectItem><SelectItem value="研究專案">研究專案</SelectItem></SelectContent></Select></div>
        <div><Label>狀態</Label><Select name="status" value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="進行中">進行中</SelectItem><SelectItem value="已完成">已完成</SelectItem><SelectItem value="計劃中">計劃中</SelectItem></SelectContent></Select></div>
        <div><Label htmlFor="start_year">開始年份</Label><Input id="start_year" name="start_year" type="number" value={formData.start_year || ''} onChange={handleChange} /></div>
        <div><Label htmlFor="end_year">結束年份</Label><Input id="end_year" name="end_year" type="number" value={formData.end_year || ''} onChange={handleChange} /></div>
        <div><Label htmlFor="funding_source">資助來源</Label><Input id="funding_source" name="funding_source" value={formData.funding_source} onChange={handleChange} /></div>
        <div><Label htmlFor="budget">預算</Label><Input id="budget" name="budget" value={formData.budget} onChange={handleChange} /></div>
        <div><Label htmlFor="participants">參與人員</Label><Input id="participants" name="participants" value={formData.participants} onChange={handleChange} /></div>
      </div>
      <div><Label htmlFor="image_url">圖片網址</Label><Input id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} /></div>
      <div><Label htmlFor="keywords">關鍵字 (以逗號分隔)</Label><Input id="keywords" name="keywords" value={formData.keywords} onChange={handleChange} /></div>
      <div><Label htmlFor="description">描述</Label><Textarea id="description" name="description" value={formData.description} onChange={handleChange} required /></div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">取消</Button></DialogClose>
        <Button type="submit">{item ? '更新' : '新增'}</Button>
      </DialogFooter>
    </form>
  );
};

function AdminResearchContent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await Research.list();
    setItems(data);
    setLoading(false);
  };

  const handleSubmit = async (data) => {
    if (editingItem) {
      await Research.update(editingItem.id, data);
    } else {
      await Research.create(data);
    }
    setShowForm(false);
    setEditingItem(null);
    loadData();
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    await Research.delete(itemToDelete.id);
    setItemToDelete(null);
    loadData();
  };

  if (loading) return <div>載入中...</div>;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2"><Microscope />研究管理</h1>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingItem(null)}><Plus className="mr-2 h-4 w-4" /> 新增研究</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>{editingItem ? "編輯研究" : "新增研究"}</DialogTitle></DialogHeader><ResearchForm item={editingItem} onSubmit={handleSubmit} /></DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader><CardTitle>研究列表</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div><p className="font-semibold">{item.title}</p><p className="text-sm text-slate-500">{item.type} - {item.status}</p></div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => { setEditingItem(item); setShowForm(true); }}><Edit className="mr-2 h-4 w-4"/>編輯</Button>
                  <Button variant="destructive" size="sm" onClick={() => setItemToDelete(item)}><Trash2 className="mr-2 h-4 w-4"/>刪除</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
          <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>確定要刪除嗎？</AlertDialogTitle><AlertDialogDescription>此操作無法復原，將永久刪除此筆資料。</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>取消</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>確定刪除</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default function AdminResearch() {
  return <AdminProtection><AdminResearchContent /></AdminProtection>;
}