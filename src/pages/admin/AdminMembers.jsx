import React, { useState, useEffect } from "react";
import { Teacher, Member } from "@/entities/all";
import AdminProtection from "@/components/admin/AdminProtection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Edit, Trash2, GraduationCap } from "lucide-react";

const MemberForm = ({ member, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(member || { name: '', position: '碩士生', status: '在學', year: '', research_topic: '', email: '', photo_url: '', bio: '', graduation_year: '' });

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
        <div><Label htmlFor="name">姓名</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} required /></div>
        <div><Label htmlFor="email">電子郵件</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} /></div>
        <div><Label>職位</Label><Select name="position" value={formData.position} onValueChange={(v) => handleSelectChange('position', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="博士生">博士生</SelectItem><SelectItem value="碩士生">碩士生</SelectItem><SelectItem value="大學生">大學生</SelectItem><SelectItem value="研究助理">研究助理</SelectItem><SelectItem value="博士後研究員">博士後研究員</SelectItem></SelectContent></Select></div>
        <div><Label>狀態</Label><Select name="status" value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="在學">在學</SelectItem><SelectItem value="已畢業">已畢業</SelectItem><SelectItem value="已離職">已離職</SelectItem></SelectContent></Select></div>
        <div><Label htmlFor="year">入學年份</Label><Input id="year" name="year" value={formData.year} onChange={handleChange} /></div>
        <div><Label htmlFor="graduation_year">畢業年份</Label><Input id="graduation_year" name="graduation_year" value={formData.graduation_year} onChange={handleChange} /></div>
      </div>
      <div><Label htmlFor="research_topic">研究主題</Label><Input id="research_topic" name="research_topic" value={formData.research_topic} onChange={handleChange} /></div>
      <div><Label htmlFor="photo_url">照片網址</Label><Input id="photo_url" name="photo_url" value={formData.photo_url} onChange={handleChange} /></div>
      <div><Label htmlFor="bio">個人簡介</Label><Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} /></div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">取消</Button></DialogClose>
        <Button type="submit">{member ? '更新成員' : '新增成員'}</Button>
      </DialogFooter>
    </form>
  );
};

const TeacherForm = ({ teacher, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(teacher || { name: '', title: '', email: '', phone: '', bio: '', education: '', research_interests: '', office: '', photo_url: '', is_primary: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label htmlFor="name">姓名</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} required /></div>
        <div><Label htmlFor="title">職稱</Label><Input id="title" name="title" value={formData.title} onChange={handleChange} required /></div>
        <div><Label htmlFor="email">電子郵件</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} /></div>
        <div><Label htmlFor="phone">聯絡電話</Label><Input id="phone" name="phone" value={formData.phone} onChange={handleChange} /></div>
        <div><Label htmlFor="office">辦公室</Label><Input id="office" name="office" value={formData.office} onChange={handleChange} /></div>
         <div className="flex items-center space-x-2 pt-6"><input type="checkbox" id="is_primary" name="is_primary" checked={formData.is_primary} onChange={handleChange} className="h-4 w-4" /><Label htmlFor="is_primary" className="text-sm font-medium">設為主要指導教授</Label></div>
      </div>
      <div><Label htmlFor="photo_url">照片網址</Label><Input id="photo_url" name="photo_url" value={formData.photo_url} onChange={handleChange} /></div>
      <div><Label htmlFor="education">學歷背景</Label><Textarea id="education" name="education" value={formData.education} onChange={handleChange} /></div>
      <div><Label htmlFor="research_interests">研究興趣</Label><Textarea id="research_interests" name="research_interests" value={formData.research_interests} onChange={handleChange} /></div>
      <div><Label htmlFor="bio">個人簡介</Label><Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} /></div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">取消</Button></DialogClose>
        <Button type="submit">{teacher ? '更新教授' : '新增教授'}</Button>
      </DialogFooter>
    </form>
  );
};

function AdminMembersContent() {
  const [teachers, setTeachers] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [teacherData, memberData] = await Promise.all([Teacher.list(), Member.list()]);
    setTeachers(teacherData);
    setMembers(memberData);
    setLoading(false);
  };

  const handleMemberSubmit = async (data) => {
    if (editingMember) {
      await Member.update(editingMember.id, data);
    } else {
      await Member.create(data);
    }
    setShowMemberForm(false);
    setEditingMember(null);
    loadData();
  };

  const handleTeacherSubmit = async (data) => {
    if (editingTeacher) {
      await Teacher.update(editingTeacher.id, data);
    } else {
      await Teacher.create(data);
    }
    setShowTeacherForm(false);
    setEditingTeacher(null);
    loadData();
  };

  const handleDelete = async () => {
    if (!itemToDelete || !deleteType) return;
    if (deleteType === 'member') {
      await Member.delete(itemToDelete.id);
    } else if (deleteType === 'teacher') {
      await Teacher.delete(itemToDelete.id);
    }
    setItemToDelete(null);
    setDeleteType('');
    loadData();
  };

  if (loading) return <div>載入中...</div>;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2"><Users />成員管理</h1>
        </div>
        
        <Tabs defaultValue="teachers">
          <TabsList className="mb-4">
            <TabsTrigger value="teachers">指導教授</TabsTrigger>
            <TabsTrigger value="members">實驗室成員</TabsTrigger>
          </TabsList>
          
          <TabsContent value="teachers">
            <Card>
              <CardHeader>
                <CardTitle>指導教授列表</CardTitle>
                <Dialog open={showTeacherForm} onOpenChange={setShowTeacherForm}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingTeacher(null)}><UserPlus className="mr-2 h-4 w-4" /> 新增教授</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>{editingTeacher ? "編輯教授" : "新增教授"}</DialogTitle></DialogHeader><TeacherForm teacher={editingTeacher} onSubmit={handleTeacherSubmit} onCancel={() => setShowTeacherForm(false)} /></DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                {teachers.map(teacher => (
                  <div key={teacher.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div><p className="font-semibold">{teacher.name}</p><p className="text-sm text-slate-500">{teacher.title}</p></div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => { setEditingTeacher(teacher); setShowTeacherForm(true); }}><Edit className="mr-2 h-4 w-4"/>編輯</Button>
                      <Button variant="destructive" size="sm" onClick={() => { setItemToDelete(teacher); setDeleteType('teacher'); }}><Trash2 className="mr-2 h-4 w-4"/>刪除</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>實驗室成員列表</CardTitle>
                <Dialog open={showMemberForm} onOpenChange={setShowMemberForm}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingMember(null)}><UserPlus className="mr-2 h-4 w-4" /> 新增成員</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>{editingMember ? "編輯成員" : "新增成員"}</DialogTitle></DialogHeader><MemberForm member={editingMember} onSubmit={handleMemberSubmit} onCancel={() => setShowMemberForm(false)} /></DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                {members.map(member => (
                  <div key={member.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div><p className="font-semibold">{member.name}</p><p className="text-sm text-slate-500">{member.position} - {member.status}</p></div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => { setEditingMember(member); setShowMemberForm(true); }}><Edit className="mr-2 h-4 w-4"/>編輯</Button>
                      <Button variant="destructive" size="sm" onClick={() => { setItemToDelete(member); setDeleteType('member'); }}><Trash2 className="mr-2 h-4 w-4"/>刪除</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>確定要刪除嗎？</AlertDialogTitle><AlertDialogDescription>此操作無法復原，將永久刪除此筆資料。</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>取消</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>確定刪除</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default function AdminMembers() {
  return <AdminProtection><AdminMembersContent /></AdminProtection>;
}