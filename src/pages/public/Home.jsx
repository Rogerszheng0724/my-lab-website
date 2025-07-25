
import React, { useState, useEffect } from "react";
import { Teacher, Research, Member, Publication } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ArrowRight, 
  Users, 
  Microscope, 
  FileText, 
  Award,
  ChevronRight,
  BookOpen,
  Target,
  Star,
  Image // Added Image import
} from "lucide-react";

export default function Home() {
  const [teacher, setTeacher] = useState(null);
  const [recentPublications, setRecentPublications] = useState([]);
  const [researchAreas, setResearchAreas] = useState([]);
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [teacherData, publications, research, members] = await Promise.all([
        Teacher.list(),
        Publication.list('-year', 3),
        Research.filter({ type: '研究方向' }, '-created_date', 3),
        Member.filter({ status: '在學' })
      ]);

      setTeacher(teacherData.find(t => t.is_primary) || teacherData[0]);
      setRecentPublications(publications);
      setResearchAreas(research);
      setMemberCount(members.length);
    } catch (error) {
      console.error('載入資料時發生錯誤:', error);
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  <Star className="w-4 h-4 mr-2" />
                  柯柯資科LAB
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  資料科學
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    你我做起
                  </span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  實驗室歡迎您的加入
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link to={createPageUrl("Research")}>
                  <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl shadow-lg">
                    探索研究
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to={createPageUrl("Members")}>
                  <Button variant="outline" className="px-8 py-3 rounded-xl border-2 hover:bg-slate-50">
                    認識團隊
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{memberCount}</div>
                  <div className="text-sm text-slate-500">實驗室成員</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{recentPublications.length}</div>
                  <div className="text-sm text-slate-500">近期發表</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{researchAreas.length}</div>
                  <div className="text-sm text-slate-500">研究方向</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl opacity-20 blur-xl"></div>
              <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
                <CardContent className="p-0">
                  <img 
                    src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=400&fit=crop"
                    alt="實驗室"
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-6 bg-gradient-to-t from-white to-white/90">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">現代化研究環境</h3>
                    <p className="text-slate-600 text-sm">配備先進儀器設備，提供優質研究空間</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Professor Section */}
      {teacher && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">指導教授</h2>
              <p className="text-lg text-slate-600">實驗室學術領導者</p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <Card className="overflow-hidden shadow-xl rounded-3xl border-0">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-3 gap-0">
                    <div className="md:col-span-1 bg-gradient-to-br from-blue-500 to-indigo-600 p-8 flex items-center justify-center">
                      {teacher.photo_url ? (
                        <img 
                          src={teacher.photo_url}
                          alt={teacher.name}
                          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                          <Users className="w-16 h-16 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2 p-8">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">{teacher.name}</h3>
                          <p className="text-blue-600 font-medium">{teacher.title}</p>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{teacher.bio}</p>
                        <div className="space-y-2">
                          {teacher.email && (
                            <p className="text-sm text-slate-500">📧 {teacher.email}</p>
                          )}
                          {teacher.office && (
                            <p className="text-sm text-slate-500">🏢 {teacher.office}</p>
                          )}
                        </div>
                        {teacher.research_interests && (
                          <div className="pt-4">
                            <h4 className="font-semibold text-slate-800 mb-2">研究興趣</h4>
                            <p className="text-slate-600 text-sm">{teacher.research_interests}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Research Areas */}
      {researchAreas.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">研究方向</h2>
              <p className="text-lg text-slate-600">探索前沿機器學習領域</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {researchAreas.map((research) => (
                <Card key={research.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg rounded-2xl overflow-hidden">
                  <CardContent className="p-0">
                    {research.image_url && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={research.image_url}
                          alt={research.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-2 text-blue-600">
                        <Target className="w-4 h-4" />
                        <span className="text-sm font-medium">研究方向</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {research.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {research.description.slice(0, 120)}...
                      </p>
                      <div className="flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                        <span>了解更多</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to={createPageUrl("Research")}>
                <Button variant="outline" className="px-8 py-3 rounded-xl">
                  查看所有研究
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Recent Publications */}
      {recentPublications.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">近期發表</h2>
              <p className="text-lg text-slate-600">最新研究成果</p>
            </div>
            
            <div className="space-y-6">
              {recentPublications.map((pub) => (
                <Card key={pub.id} className="hover:shadow-lg transition-shadow border-0 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {pub.type}
                          </span>
                          <span className="text-sm text-slate-500">{pub.year}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                          {pub.title}
                        </h3>
                        <p className="text-slate-600 text-sm">{pub.authors}</p>
                        {pub.journal && (
                          <p className="text-slate-500 text-sm font-medium">{pub.journal}</p>
                        )}
                      </div>
                      {pub.pdf_url && (
                        <a 
                          href={pub.pdf_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to={createPageUrl("Publications")}>
                <Button variant="outline" className="px-8 py-3 rounded-xl">
                  查看所有著作
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">探索更多</h2>
            <p className="text-lg text-slate-600">了解實驗室各個面向</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to={createPageUrl("Members")}>
              <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-blue-600 transition-colors">
                    <Users className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">成員介紹</h3>
                  <p className="text-slate-600 text-sm">認識我們的研究團隊</p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl("Courses")}>
              <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-green-600 transition-colors">
                    <BookOpen className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">開設課程</h3>
                  <p className="text-slate-600 text-sm">開課資訊</p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl("Awards")}>
              <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-yellow-600 transition-colors">
                    <Award className="w-8 h-8 text-yellow-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">獲獎紀錄</h3>
                  <p className="text-slate-600 text-sm">學術榮譽與成就</p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl("Gallery")}>
              <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-purple-600 transition-colors">
                    <Image className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">活動相簿</h3>
                  <p className="text-slate-600 text-sm">實驗室精彩時光</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
