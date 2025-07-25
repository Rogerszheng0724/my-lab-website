import React, { useState, useEffect } from "react";
import { Course } from "@/entities/all";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Calendar, Users, FileText, GraduationCap } from "lucide-react";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, yearFilter, levelFilter]);

  const loadCourses = async () => {
    try {
      const courseData = await Course.list('-year');
      setCourses(courseData);
    } catch (error) {
      console.error('載入課程資料時發生錯誤:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (yearFilter !== 'all') {
      filtered = filtered.filter(course => course.year.toString() === yearFilter);
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(course => course.level === levelFilter);
    }

    setFilteredCourses(filtered);
  };

  const levelColors = {
    '大學部': 'bg-green-100 text-green-800',
    '碩士班': 'bg-blue-100 text-blue-800',
    '博士班': 'bg-purple-100 text-purple-800'
  };

  const semesterNames = {
    '1': '上學期',
    '2': '下學期',
    'summer': '暑期'
  };

  const getYears = () => {
    const years = [...new Set(courses.map(course => course.year))].sort((a, b) => b - a);
    return years;
  };

  const groupCoursesByYear = () => {
    const grouped = {};
    filteredCourses.forEach(course => {
      if (!grouped[course.year]) {
        grouped[course.year] = [];
      }
      grouped[course.year].push(course);
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

  const groupedCourses = groupCoursesByYear();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">開設課程</h1>
          <p className="text-xl text-slate-600">歷年教學課程資訊</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4 items-center">
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="選擇學年" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有學年</SelectItem>
                  {getYears().map(year => (
                    <SelectItem key={year} value={year.toString()}>{year} 學年</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="選擇層級" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有層級</SelectItem>
                  <SelectItem value="大學部">大學部</SelectItem>
                  <SelectItem value="碩士班">碩士班</SelectItem>
                  <SelectItem value="博士班">博士班</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-slate-500 text-center">
                共 {filteredCourses.length} 門課程
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses by Year */}
        {Object.keys(groupedCourses).length > 0 ? (
          <div className="space-y-12">
            {Object.keys(groupedCourses).sort((a, b) => b - a).map(year => (
              <div key={year} className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {year} 學年
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded mx-auto"></div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedCourses[year].map((course) => (
                    <Card key={course.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg rounded-2xl overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-1">
                        <div className="bg-white rounded-2xl">
                          <CardContent className="p-6 space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                              </div>
                              <Badge className={`${levelColors[course.level]} border-0`}>
                                {course.level}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                                {course.title}
                              </h3>
                              
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span className="font-medium text-blue-600">{course.code}</span>
                                <span>•</span>
                                <span>{course.credits} 學分</span>
                              </div>
                            </div>
                            
                            <div className="space-y-3 text-sm text-slate-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span>{semesterNames[course.semester] || course.semester}</span>
                              </div>
                              
                              {course.instructor && (
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-slate-400" />
                                  <span>授課教師：{course.instructor}</span>
                                </div>
                              )}
                            </div>
                            
                            {course.description && (
                              <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-slate-600 text-sm leading-relaxed">
                                  {course.description.length > 120 
                                    ? `${course.description.slice(0, 120)}...` 
                                    : course.description
                                  }
                                </p>
                              </div>
                            )}
                            
                            {course.syllabus_url && (
                              <div className="pt-2 border-t border-slate-100">
                                <a 
                                  href={course.syllabus_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                                >
                                  <FileText className="w-4 h-4" />
                                  課程大綱
                                </a>
                              </div>
                            )}
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {courses.length === 0 ? (
              <>
                <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">暫無課程資料</p>
              </>
            ) : (
              <>
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">找不到符合條件的課程</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}