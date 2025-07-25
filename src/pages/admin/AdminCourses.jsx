import React, { useState, useEffect } from "react";
import { Course } from "@/entities/all";
import AdminProtection from "@/components/admin/AdminProtection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, Edit, Trash2 } from "lucide-react";

const CourseForm = ({ item, onSubmit }) => {
  const [formData, setFormData] = useState(item || { title: '', code: '', semester: '1', year: '', credits: '', description: '', syllabus_url: '', instructor: '', level: '大學部' });

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
        <div><Label htmlFor="title">課程名稱</Label><Input id="title" name="title" value={formData.title} onChange={handleChange} required /></div>
        <div><Label htmlFor="code">課程代碼</Label><Input id="code" name="code" value={formData.code} onChange={handleChange} /></div>
        <div><Label htmlFor="year">學年</Label><Input id="year" name="year" type="number" value={formData.year || ''} onChange={handleChange} required /></div>
        <div><Label>學期</Label><Select name="semester" value={formData.semester} onValueChange={(v) => handleSelectChange('semester', v)} required><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">上學期</SelectItem><SelectItem value="2">下學期</SelectItem><SelectItem value="summer">暑期</SelectItem></SelectContent></Select></div>
        <div><Label htmlFor="credits">學分數</Label><Input id="credits" name="credits" type="number" value={formData.credits || ''} onChange={handleChange} /></div>
        <div><Label htmlFor="instructor">授課教師</Label><Input id="instructor" name="instructor" value={formData.instructor} onChange={handleChange} /></div>
        <div><Label>開課層級</Label><Select name="level" value={formData.level} onValueChange={(v) => handleSelectChange('level', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="大學部">大學部</SelectItem><SelectItem value="碩士班">碩士班</SelectItem><SelectItem value="博士班">博士班</SelectItem></SelectContent></Select></div>
        <div><Label htmlFor="syllabus_url">課程大綱網址</Label><Input id="syllabus_url" name="syllabus_url" value={formData.syllabus_url} onChange={handleChange} /></div>
      </div>
      <div><Label htmlFor="description">課程描述</Label><Textarea id="description" name="description" value={formData.description} onChange={handleChange} /></div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">取消</Button></DialogClose>
        <Button type="submit">{item ? '更新' : '新增'}</Button>
      </DialogFooter>
    </form>
  );
};

function AdminCoursesContent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await Course.list();
    setItems(data);
    setLoading(false);
  };

  const handleSubmit = async (data) => {
    const payload = {...data, year: parseInt(data.year, 10), credits: data.credits ? parseInt(data.credits, 10) : null};
    if (editingItem) {
      await Course.update(editingItem.id, payload);
    } else {
      await Course.create(payload);
    }
    setShowForm(false);
    setEditingItem(null);
    loadData();
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    await Course.delete(itemToDelete.id);
    setItemToDelete(null);
    loadData();
  };

  if (loading) return <div>載入中...</div>;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2"><BookOpen />課程管理</h1>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild><Button onClick={() => setEditingItem(null)}><Plus className="mr-2 h-4 w-4" /> 新增課程</Button></DialogTrigger>
            <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>{editingItem ? "編輯課程" : "新增課程"}</DialogTitle></DialogHeader><CourseForm item={editingItem} onSubmit={handleSubmit} /></DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardHeader><CardTitle>課程列表</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div><p className="font-semibold">{item.title}</p><p className="text-sm text-slate-500">{item.year}學年 - {item.level}</p></div>
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

export default function AdminCourses() {
  return <AdminProtection><AdminCoursesContent /></AdminProtection>;
}