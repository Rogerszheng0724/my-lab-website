import React, { useState, useEffect } from "react";
import { Teacher, Member } from "@/entities/all";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Mail, GraduationCap, Calendar, User } from "lucide-react";

export default function Members() {
  const [teachers, setTeachers] = useState([]);
  const [currentMembers, setCurrentMembers] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const [teacherData, memberData] = await Promise.all([
        Teacher.list('-created_date'),
        Member.list('-created_date')
      ]);

      setTeachers(teacherData);
      setCurrentMembers(memberData.filter(m => m.status === '在學'));
      setAlumni(memberData.filter(m => m.status === '已畢業'));
    } catch (error) {
      console.error('載入成員資料時發生錯誤:', error);
    } finally {
      setLoading(false);
    }
  };

  const positionColors = {
    '博士生': 'bg-red-100 text-red-800',
    '碩士生': 'bg-blue-100 text-blue-800',
    '大學生': 'bg-green-100 text-green-800',
    '研究助理': 'bg-purple-100 text-purple-800',
    '博士後研究員': 'bg-orange-100 text-orange-800'
  };

  const MemberCard = ({ member, showGraduation = false }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {member.photo_url ? (
            <img 
              src={member.photo_url}
              alt={member.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <User className="w-16 h-16 text-slate-400" />
            </div>
          )}
          <div className="absolute top-4 right-4">
            <Badge className={`${positionColors[member.position]} border-0 shadow-sm`}>
              {member.position}
            </Badge>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{member.name}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
              <Calendar className="w-4 h-4" />
              <span>
                {showGraduation && member.graduation_year 
                  ? `${member.year} - ${member.graduation_year}`
                  : member.year
                }
              </span>
            </div>
          </div>
          
          {member.research_topic && (
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800 text-sm">研究主題</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{member.research_topic}</p>
            </div>
          )}
          
          {member.bio && (
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800 text-sm">簡介</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                {member.bio.length > 100 ? `${member.bio.slice(0, 100)}...` : member.bio}
              </p>
            </div>
          )}
          
          {member.email && (
            <div className="pt-2 border-t border-slate-100">
              <a 
                href={`mailto:${member.email}`}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{member.email}</span>
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const TeacherCard = ({ teacher }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg rounded-3xl overflow-hidden">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-3">
          <div className="md:col-span-1 bg-gradient-to-br from-blue-500 to-indigo-600 p-8 flex items-center justify-center">
            {teacher.photo_url ? (
              <img 
                src={teacher.photo_url}
                alt={teacher.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
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
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{teacher.name}</h3>
                <p className="text-blue-600 font-medium text-lg">{teacher.title}</p>
              </div>
              
              {teacher.bio && (
                <p className="text-slate-600 leading-relaxed">{teacher.bio}</p>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                {teacher.email && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <a href={`mailto:${teacher.email}`} className="hover:text-blue-600 transition-colors">
                      {teacher.email}
                    </a>
                  </div>
                )}
                {teacher.office && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="w-4 h-4 text-blue-500">🏢</span>
                    <span>{teacher.office}</span>
                  </div>
                )}
                {teacher.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="w-4 h-4 text-blue-500">📞</span>
                    <span>{teacher.phone}</span>
                  </div>
                )}
              </div>
              
              {teacher.education && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-500" />
                    學歷背景
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{teacher.education}</p>
                </div>
              )}
              
              {teacher.research_interests && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-semibold text-slate-800 mb-2">研究興趣</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{teacher.research_interests}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">實驗室成員</h1>
          <p className="text-xl text-slate-600">認識我們的研究團隊</p>
        </div>

        <Tabs defaultValue="teachers" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-slate-100 rounded-2xl p-2">
            <TabsTrigger value="teachers" className="rounded-xl">指導教授</TabsTrigger>
            <TabsTrigger value="current" className="rounded-xl">在學成員</TabsTrigger>
            <TabsTrigger value="alumni" className="rounded-xl">畢業校友</TabsTrigger>
          </TabsList>

          {/* Teachers */}
          <TabsContent value="teachers" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">指導教授</h2>
              <p className="text-slate-600">實驗室學術領導者</p>
            </div>
            
            {teachers.length > 0 ? (
              <div className="space-y-8">
                {teachers.map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">暫無教授資料</p>
              </div>
            )}
          </TabsContent>

          {/* Current Members */}
          <TabsContent value="current" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                在學成員 ({currentMembers.length})
              </h2>
              <p className="text-slate-600">目前實驗室研究團隊</p>
            </div>
            
            {currentMembers.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">暫無在學成員資料</p>
              </div>
            )}
          </TabsContent>

          {/* Alumni */}
          <TabsContent value="alumni" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                畢業校友 ({alumni.length})
              </h2>
              <p className="text-slate-600">實驗室歷屆畢業生</p>
            </div>
            
            {alumni.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {alumni.map((member) => (
                  <MemberCard key={member.id} member={member} showGraduation={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">暫無校友資料</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}