import React, { useState, useEffect } from "react";
import { Gallery } from "@/entities/all";
import AdminProtection from "@/components/admin/AdminProtection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image as ImageIcon, Plus, Edit, Trash2, XCircle } from "lucide-react";

const GalleryForm = ({ item, onSubmit }) => {
  const [formData, setFormData] = useState(item || { title: '', description: '', cover_image_url: '', images: [], event_date: '', category: '實驗室活動' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, field, value) => {
    const newImages = [...formData.images];
    newImages[index][field] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImage = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, { url: '', caption: '', date: '' }] }));
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><Label htmlFor="title">相簿標題</Label><Input id="title" name="title" value={formData.title} onChange={handleChange} required /></div>
      <div><Label htmlFor="cover_image_url">封面圖片網址</Label><Input id="cover_image_url" name="cover_image_url" value={formData.cover_image_url} onChange={handleChange} required /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label htmlFor="event_date">活動日期</Label><Input id="event_date" name="event_date" type="date" value={formData.event_date || ''} onChange={handleChange} /></div>
        <div><Label>類別</Label><Select name="category" value={formData.category} onValueChange={(v) => handleSelectChange('category', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="實驗室活動">實驗室活動</SelectItem><SelectItem value="會議研討">會議研討</SelectItem><SelectItem value="畢業典禮">畢業典禮</SelectItem><SelectItem value="其他">其他</SelectItem></SelectContent></Select></div>
      </div>
      <div><Label htmlFor="description">描述</Label><Textarea id="description" name="description" value={formData.description} onChange={handleChange} /></div>
      
      <div className="space-y-4"><Label>相片列表</Label>
        {formData.images.map((img, index) => (
          <div key={index} className="flex items-start gap-2 p-3 border rounded-lg">
            <div className="flex-grow space-y-2">
              <Input placeholder="圖片網址" value={img.url} onChange={(e) => handleImageChange(index, 'url', e.target.value)} />
              <Input placeholder="圖片說明" value={img.caption} onChange={(e) => handleImageChange(index, 'caption', e.target.value)} />
              <Input type="date" value={img.date || ''} onChange={(e) => handleImageChange(index, 'date', e.target.value)} />
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(index)}><XCircle className="h-5 w-5 text-red-500" /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addImage}>新增相片</Button>
      </div>
      
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">取消</Button></DialogClose>
        <Button type="submit">{item ? '更新' : '新增'}</Button>
      </DialogFooter>
    </form>
  );
};

function AdminGalleryContent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await Gallery.list();
    setItems(data);
    setLoading(false);
  };

  const handleSubmit = async (data) => {
    if (editingItem) {
      await Gallery.update(editingItem.id, data);
    } else {
      await Gallery.create(data);
    }
    setShowForm(false);
    setEditingItem(null);
    loadData();
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    await Gallery.delete(itemToDelete.id);
    setItemToDelete(null);
    loadData();
  };

  if (loading) return <div>載入中...</div>;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2"><ImageIcon />相簿管理</h1>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild><Button onClick={() => setEditingItem(null)}><Plus className="mr-2 h-4 w-4" /> 新增相簿</Button></DialogTrigger>
            <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>{editingItem ? "編輯相簿" : "新增相簿"}</DialogTitle></DialogHeader><GalleryForm item={editingItem} onSubmit={handleSubmit} /></DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardHeader><CardTitle>相簿列表</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div><p className="font-semibold">{item.title}</p><p className="text-sm text-slate-500">{item.category}</p></div>
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

export default function AdminGallery() {
  return <AdminProtection><AdminGalleryContent /></AdminProtection>;
}