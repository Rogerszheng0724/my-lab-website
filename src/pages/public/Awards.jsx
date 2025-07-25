import React, { useState, useEffect } from "react";
import { Award } from "@/entities/all";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Calendar, User, Building, Star, Award as AwardIcon, GraduationCap, Heart } from "lucide-react";

export default function Awards() {
  const [awards, setAwards] = useState([]);
  const [filteredAwards, setFilteredAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    loadAwards();
  }, []);

  useEffect(() => {
    filterAwards();
  }, [awards, yearFilter, categoryFilter]);

  const loadAwards = async () => {
    try {
      const awardData = await Award.list('-year');
      setAwards(awardData);
    } catch (error) {
      console.error('載入獲獎資料時發生錯誤:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAwards = () => {
    let filtered = awards;

    if (yearFilter !== 'all') {
      filtered = filtered.filter(award => award.year.toString() === yearFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(award => award.category === categoryFilter);
    }

    setFilteredAwards(filtered);
  };

  const categoryColors = {
    '學術獎項': 'bg-blue-100 text-blue-800',
    '教學獎項': 'bg-green-100 text-green-800',
    '服務獎項': 'bg-purple-100 text-purple-800',
    '學生獎項': 'bg-orange-100 text-orange-800'
  };

  const categoryIcons = {
    '學術獎項': Star,
    '教學獎項': GraduationCap,
    '服務獎項': Heart,
    '學生獎項': Trophy
  };

  const getYears = () => {
    const years = [...new Set(awards.map(award => award.year))].sort((a, b) => b - a);
    return years;
  };

  const groupAwardsByYear = () => {
    const grouped = {};
    filteredAwards.forEach(award => {
      if (!grouped[award.year]) {
        grouped[award.year] = [];
      }
      grouped[award.year].push(award);
    });
    return grouped;
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

  const groupedAwards = groupAwardsByYear();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">獲獎紀錄</h1>
          <p className="text-xl text-slate-600">學術榮譽與傑出表現</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {Object.entries(categoryColors).map(([category, colorClass]) => {
            const count = awards.filter(award => award.category === category).length;
            const CategoryIcon = categoryIcons[category];
            return (
              <Card key={category} className="border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${colorClass.replace('text-', 'bg-').replace('800', '100')} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <CategoryIcon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{count}</div>
                  <div className="text-sm text-slate-500">{category}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4 items-center">
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="選擇年份" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有年份</SelectItem>
                  {getYears().map(year => (
                    <SelectItem key={year} value={year.toString()}>{year} 年</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="選擇類別" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有類別</SelectItem>
                  <SelectItem value="學術獎項">學術獎項</SelectItem>
                  <SelectItem value="教學獎項">教學獎項</SelectItem>
                  <SelectItem value="服務獎項">服務獎項</SelectItem>
                  <SelectItem value="學生獎項">學生獎項</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-slate-500 text-center">
                共 {filteredAwards.length} 項獲獎
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Awards by Year */}
        {Object.keys(groupedAwards).length > 0 ? (
          <div className="space-y-12">
            {Object.keys(groupedAwards).sort((a, b) => b - a).map(year => (
              <div key={year} className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {year} 年
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded mx-auto"></div>
                </div>
                
                <div className="space-y-4">
                  {groupedAwards[year].map((award) => {
                    const CategoryIcon = categoryIcons[award.category];
                    return (
                      <Card key={award.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg rounded-2xl overflow-hidden">
                        <CardContent className="p-0">
                          <div className="grid lg:grid-cols-4 gap-0">
                            {/* Award Icon Section */}
                            <div className="lg:col-span-1 bg-gradient-to-br from-yellow-400 to-orange-500 p-8 flex items-center justify-center">
                              <div className="text-center text-white">
                                <CategoryIcon className="w-12 h-12 mx-auto mb-2" />
                                <Badge className="bg-white/20 text-white border-0">
                                  {award.category}
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Award Details */}
                            <div className="lg:col-span-2 p-8 space-y-4">
                              <div>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-yellow-600 transition-colors mb-2">
                                  {award.title}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-slate-600">
                                  <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    <span>{award.recipient}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Building className="w-4 h-4" />
                                    <span>{award.organization}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{award.year}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {award.description && (
                                <div className="bg-slate-50 rounded-xl p-4">
                                  <p className="text-slate-600 text-sm leading-relaxed">
                                    {award.description}
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            {/* Certificate Image */}
                            <div className="lg:col-span-1 bg-slate-50 p-8 flex items-center justify-center">
                              {award.certificate_url ? (
                                <img 
                                  src={award.certificate_url}
                                  alt={`${award.title} 獎狀`}
                                  className="w-full h-32 object-cover rounded-xl shadow-sm group-hover:shadow-lg transition-shadow"
                                />
                              ) : (
                                <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                                  <AwardIcon className="w-12 h-12 text-slate-400" />
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {awards.length === 0 ? (
              <>
                <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">暫無獲獎資料</p>
              </>
            ) : (
              <>
                <AwardIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">找不到符合條件的獲獎紀錄</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}