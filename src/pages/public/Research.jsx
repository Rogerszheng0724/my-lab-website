import React, { useState, useEffect } from "react";
import { Research } from "@/entities/all";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Microscope, Target, Calendar, Users, DollarSign, CheckCircle, Clock, Lightbulb } from "lucide-react";

export default function ResearchPage() {
  const [researchAreas, setResearchAreas] = useState([]);
  const [researchProjects, setResearchProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResearch();
  }, []);

  const loadResearch = async () => {
    try {
      const researchData = await Research.list('-created_date');
      setResearchAreas(researchData.filter(r => r.type === '研究方向'));
      setResearchProjects(researchData.filter(r => r.type === '研究專案'));
    } catch (error) {
      console.error('載入研究資料時發生錯誤:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    '進行中': 'bg-green-100 text-green-800',
    '已完成': 'bg-blue-100 text-blue-800',
    '計劃中': 'bg-yellow-100 text-yellow-800'
  };

  const statusIcons = {
    '進行中': Clock,
    '已完成': CheckCircle,
    '計劃中': Lightbulb
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">研究領域</h1>
          <p className="text-xl text-slate-600">探索前沿科學技術</p>
        </div>

        <Tabs defaultValue="areas" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-slate-100 rounded-2xl p-2">
            <TabsTrigger value="areas" className="rounded-xl">研究方向</TabsTrigger>
            <TabsTrigger value="projects" className="rounded-xl">研究專案</TabsTrigger>
          </TabsList>

          {/* Research Areas */}
          <TabsContent value="areas" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">研究方向</h2>
              <p className="text-slate-600">我們專注的核心研究領域</p>
            </div>
            
            {researchAreas.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {researchAreas.map((research) => (
                  <Card key={research.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg rounded-3xl overflow-hidden">
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
                      <div className="p-8 space-y-4">
                        <div className="flex items-center gap-2 text-blue-600">
                          <Target className="w-5 h-5" />
                          <span className="text-sm font-medium">研究方向</span>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {research.title}
                        </h3>
                        
                        <p className="text-slate-600 leading-relaxed">
                          {research.description}
                        </p>
                        
                        {research.keywords && (
                          <div className="flex flex-wrap gap-2 pt-4">
                            {research.keywords.split(',').map((keyword, index) => (
                              <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700">
                                {keyword.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">暫無研究方向資料</p>
              </div>
            )}
          </TabsContent>

          {/* Research Projects */}
          <TabsContent value="projects" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">研究專案</h2>
              <p className="text-slate-600">正在進行與已完成的研究計畫</p>
            </div>
            
            {researchProjects.length > 0 ? (
              <div className="space-y-6">
                {researchProjects.map((project) => {
                  const StatusIcon = statusIcons[project.status] || Clock;
                  return (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow border-0 rounded-2xl">
                      <CardContent className="p-8">
                        <div className="grid lg:grid-cols-4 gap-6">
                          <div className="lg:col-span-3 space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <Badge className={`${statusColors[project.status]} border-0 flex items-center gap-1`}>
                                    <StatusIcon className="w-3 h-3" />
                                    {project.status}
                                  </Badge>
                                  {project.start_year && (
                                    <span className="text-slate-500 text-sm flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {project.start_year}
                                      {project.end_year && ` - ${project.end_year}`}
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">
                                  {project.title}
                                </h3>
                              </div>
                            </div>
                            
                            <p className="text-slate-600 leading-relaxed">
                              {project.description}
                            </p>
                            
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              {project.funding_source && (
                                <div className="flex items-center gap-2 text-slate-600">
                                  <DollarSign className="w-4 h-4 text-blue-500" />
                                  <span>資助來源：{project.funding_source}</span>
                                </div>
                              )}
                              
                              {project.participants && (
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Users className="w-4 h-4 text-green-500" />
                                  <span>參與人員：{project.participants}</span>
                                </div>
                              )}
                              
                              {project.budget && (
                                <div className="flex items-center gap-2 text-slate-600">
                                  <span className="text-orange-500">💰</span>
                                  <span>預算：{project.budget}</span>
                                </div>
                              )}
                            </div>
                            
                            {project.keywords && (
                              <div className="flex flex-wrap gap-2 pt-2">
                                {project.keywords.split(',').map((keyword, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {keyword.trim()}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {project.image_url && (
                            <div className="lg:col-span-1">
                              <img 
                                src={project.image_url}
                                alt={project.title}
                                className="w-full h-32 lg:h-full object-cover rounded-xl"
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Microscope className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">暫無研究專案資料</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}