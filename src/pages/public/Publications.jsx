import React, { useState, useEffect } from "react";
import { Publication } from "@/entities/all";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, ExternalLink, Search, Calendar, Users } from "lucide-react";

export default function Publications() {
  const [publications, setPublications] = useState([]);
  const [filteredPubs, setFilteredPubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadPublications();
  }, []);

  useEffect(() => {
    filterPublications();
  }, [publications, searchTerm, yearFilter, typeFilter]);

  const loadPublications = async () => {
    try {
      const pubData = await Publication.list('-year');
      setPublications(pubData);
    } catch (error) {
      console.error('載入著作資料時發生錯誤:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPublications = () => {
    let filtered = publications;

    if (searchTerm) {
      filtered = filtered.filter(pub => 
        pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pub.journal && pub.journal.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (yearFilter !== 'all') {
      filtered = filtered.filter(pub => pub.year.toString() === yearFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(pub => pub.type === typeFilter);
    }

    setFilteredPubs(filtered);
  };

  const typeColors = {
    '期刊論文': 'bg-blue-100 text-blue-800',
    '會議論文': 'bg-green-100 text-green-800',
    '書籍章節': 'bg-purple-100 text-purple-800',
    '專利': 'bg-orange-100 text-orange-800'
  };

  const getYears = () => {
    const years = [...new Set(publications.map(pub => pub.year))].sort((a, b) => b - a);
    return years;
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
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">學術著作</h1>
          <p className="text-xl text-slate-600">研究成果與學術發表</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="搜尋標題、作者或期刊..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="選擇年份" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有年份</SelectItem>
                  {getYears().map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="文章類型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有類型</SelectItem>
                  <SelectItem value="期刊論文">期刊論文</SelectItem>
                  <SelectItem value="會議論文">會議論文</SelectItem>
                  <SelectItem value="書籍章節">書籍章節</SelectItem>
                  <SelectItem value="專利">專利</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-slate-500 flex items-center justify-center">
                共 {filteredPubs.length} 篇著作
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publications List */}
        {filteredPubs.length > 0 ? (
          <div className="space-y-6">
            {filteredPubs.map((pub) => (
              <Card key={pub.id} className="hover:shadow-lg transition-shadow border-0 rounded-2xl">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge className={`${typeColors[pub.type]} border-0`}>
                            {pub.type}
                          </Badge>
                          <div className="flex items-center gap-1 text-slate-500 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{pub.year}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-900 leading-tight hover:text-blue-600 transition-colors">
                          {pub.title}
                        </h3>
                      </div>
                      
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-start gap-2">
                          <Users className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                          <span className="font-medium">{pub.authors}</span>
                        </div>
                        
                        {pub.journal && (
                          <p className="text-slate-700 font-medium">
                            {pub.journal}
                            {pub.volume && ` ${pub.volume}`}
                            {pub.pages && `, ${pub.pages}`}
                          </p>
                        )}
                      </div>
                      
                      {pub.abstract && (
                        <div className="bg-slate-50 rounded-xl p-4">
                          <h4 className="font-semibold text-slate-800 mb-2 text-sm">摘要</h4>
                          <p className="text-slate-600 text-sm leading-relaxed">
                            {pub.abstract.length > 300 
                              ? `${pub.abstract.slice(0, 300)}...` 
                              : pub.abstract
                            }
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          {pub.doi && (
                            <span>DOI: {pub.doi}</span>
                          )}
                        </div>
                        
                        {pub.pdf_url && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 rounded-xl"
                            onClick={() => window.open(pub.pdf_url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            查看全文
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {publications.length === 0 ? (
              <>
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">暫無學術著作資料</p>
              </>
            ) : (
              <>
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">找不到符合條件的著作</p>
                <Button 
                  variant="outline" 
                  className="mt-4 rounded-xl"
                  onClick={() => {
                    setSearchTerm('');
                    setYearFilter('all');
                    setTypeFilter('all');
                  }}
                >
                  清除篩選條件
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}