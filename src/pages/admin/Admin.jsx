import React, { useState, useEffect } from "react";
import { Teacher, Member, Publication, Research, Course, Award, Gallery, Contact } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Settings, 
  Users, 
  FileText, 
  Microscope, 
  BookOpen, 
  Trophy, 
  Image, 
  MapPin,
  Plus,
  Eye,
  BarChart3
} from "lucide-react";
import AdminProtection from "../../components/admin/AdminProtection";

function AdminContent() {
  const [stats, setStats] = useState({
    teachers: 0,
    members: 0,
    publications: 0,
    research: 0,
    courses: 0,
    awards: 0,
    galleries: 0,
    contacts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [teachers, members, publications, research, courses, awards, galleries, contacts] = await Promise.all([
        Teacher.list(),
        Member.list(),
        Publication.list(),
        Research.list(),
        Course.list(),
        Award.list(),
        Gallery.list(),
        Contact.list()
      ]);

      setStats({
        teachers: teachers.length,
        members: members.length,
        publications: publications.length,
        research: research.length,
        courses: courses.length,
        awards: awards.length,
        galleries: galleries.length,
        contacts: contacts.length
      });
    } catch (error) {
      console.error('載入統計資料時發生錯誤:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminSections = [
    {
      title: "成員管理",
      description: "管理實驗室成員與教授資料",
      url: createPageUrl("AdminMembers"),
      icon: Users,
      count: stats.teachers + stats.members,
      color: "bg-blue-500"
    },
    {
      title: "研究管理",
      description: "管理研究方向與專案",
      url: createPageUrl("AdminResearch"),
      icon: Microscope,
      count: stats.research,
      color: "bg-green-500"
    },
    {
      title: "著作管理",
      description: "管理學術論文與著作",
      url: createPageUrl("AdminPublications"),
      icon: FileText,
      count: stats.publications,
      color: "bg-purple-500"
    },
    {
      title: "課程管理",
      description: "管理開設課程資訊",
      url: createPageUrl("AdminCourses"),
      icon: BookOpen,
      count: stats.courses,
      color: "bg-indigo-500"
    },
    {
      title: "獲獎管理",
      description: "管理獎項與榮譽紀錄",
      url: createPageUrl("AdminAwards"),
      icon: Trophy,
      count: stats.awards,
      color: "bg-yellow-500"
    },
    {
      title: "相簿管理",
      description: "管理活動照片與相簿",
      url: createPageUrl("AdminGallery"),
      icon: Image,
      count: stats.galleries,
      color: "bg-pink-500"
    },
    {
      title: "聯絡管理",
      description: "管理聯絡資訊與地址",
      url: createPageUrl("AdminContact"),
      icon: MapPin,
      count: stats.contacts,
      color: "bg-red-500"
    }
  ];

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

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">管理控制台</h1>
              <p className="text-slate-600 mt-1">實驗室網站內容管理系統</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Link to={createPageUrl("Home")}>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border hover:shadow-sm transition-shadow text-sm text-slate-600">
                <Eye className="w-4 h-4" />
                <span>查看網站</span>
              </div>
            </Link>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl text-sm text-blue-700">
              <BarChart3 className="w-4 h-4" />
              <span>總計 {Object.values(stats).reduce((a, b) => a + b, 0)} 筆資料</span>
            </div>
          </div>
        </div>

        {/* Admin Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => (
            <Link key={section.title} to={section.url}>
              <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className={`${section.color} h-2`}></div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 ${section.color} bg-opacity-20 rounded-xl flex items-center justify-center`}>
                          <section.icon className={`w-6 h-6 ${section.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900">
                            {section.count}
                          </div>
                          <div className="text-xs text-slate-500">筆資料</div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-slate-600 text-sm mt-1">
                          {section.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-sm text-slate-500">點擊管理</span>
                        <Plus className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                系統概況
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.teachers}</div>
                  <div className="text-sm text-slate-500">指導教授</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.members}</div>
                  <div className="text-sm text-slate-500">實驗室成員</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.publications}</div>
                  <div className="text-sm text-slate-500">學術著作</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.research}</div>
                  <div className="text-sm text-slate-500">研究項目</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <AdminProtection>
      <AdminContent />
    </AdminProtection>
  );
}