import React, { useState, useEffect } from "react";
import { Gallery } from "@/entities/all";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Image, Calendar, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
import { format } from "date-fns";

export default function GalleryPage() {
  const [galleries, setGalleries] = useState([]);
  const [filteredGalleries, setFilteredGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    loadGalleries();
  }, []);

  useEffect(() => {
    filterGalleries();
  }, [galleries, categoryFilter]);

  const loadGalleries = async () => {
    try {
      const galleryData = await Gallery.list('-event_date');
      setGalleries(galleryData);
    } catch (error) {
      console.error('載入相簿資料時發生錯誤:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterGalleries = () => {
    let filtered = galleries;

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(gallery => gallery.category === categoryFilter);
    }

    setFilteredGalleries(filtered);
  };

  const categoryColors = {
    '實驗室活動': 'bg-blue-100 text-blue-800',
    '會議研討': 'bg-green-100 text-green-800',
    '畢業典禮': 'bg-purple-100 text-purple-800',
    '其他': 'bg-gray-100 text-gray-800'
  };

  const openGallery = (gallery) => {
    setSelectedGallery(gallery);
    setSelectedImageIndex(0);
    setShowImageModal(true);
  };

  const nextImage = () => {
    if (selectedGallery && selectedGallery.images) {
      setSelectedImageIndex((prev) => 
        prev === selectedGallery.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedGallery && selectedGallery.images) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? selectedGallery.images.length - 1 : prev - 1
      );
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">活動相簿</h1>
          <p className="text-xl text-slate-600">記錄實驗室的精彩時光</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4 items-center">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="選擇分類" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有分類</SelectItem>
                  <SelectItem value="實驗室活動">實驗室活動</SelectItem>
                  <SelectItem value="會議研討">會議研討</SelectItem>
                  <SelectItem value="畢業典禮">畢業典禮</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-slate-500 text-center">
                共 {filteredGalleries.length} 個相簿
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gallery Grid */}
        {filteredGalleries.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGalleries.map((gallery) => (
              <Card key={gallery.id} className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg rounded-2xl overflow-hidden cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={gallery.cover_image_url}
                      alt={gallery.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <Button
                        size="lg"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-slate-900 hover:bg-white rounded-xl"
                        onClick={() => openGallery(gallery)}
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        查看相簿
                      </Button>
                    </div>
                    
                    <div className="absolute top-4 right-4">
                      <Badge className={`${categoryColors[gallery.category]} border-0 shadow-sm`}>
                        {gallery.category}
                      </Badge>
                    </div>
                    
                    {gallery.images && gallery.images.length > 0 && (
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-black/50 text-white border-0">
                          {gallery.images.length} 張照片
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {gallery.title}
                    </h3>
                    
                    {gallery.event_date && (
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(gallery.event_date), 'yyyy年MM月dd日')}</span>
                      </div>
                    )}
                    
                    {gallery.description && (
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {gallery.description.length > 100 
                          ? `${gallery.description.slice(0, 100)}...` 
                          : gallery.description
                        }
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Image className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">
              {galleries.length === 0 ? '暫無相簿資料' : '找不到符合條件的相簿'}
            </p>
          </div>
        )}

        {/* Image Modal */}
        <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
          <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
            <DialogHeader className="absolute top-4 left-4 z-10">
              <DialogTitle className="bg-black/50 text-white px-4 py-2 rounded-lg">
                {selectedGallery?.title}
                {selectedGallery?.images && (
                  <span className="ml-2 text-sm opacity-75">
                    ({selectedImageIndex + 1} / {selectedGallery.images.length})
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
              onClick={() => setShowImageModal(false)}
            >
              <X className="w-4 h-4" />
            </Button>
            
            {selectedGallery?.images && selectedGallery.images.length > 0 && (
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <img 
                  src={selectedGallery.images[selectedImageIndex]?.url}
                  alt={selectedGallery.images[selectedImageIndex]?.caption || ''}
                  className="max-w-full max-h-full object-contain"
                />
                
                {selectedGallery.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}
                
                {selectedGallery.images[selectedImageIndex]?.caption && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-4 rounded-lg">
                    <p className="text-sm">{selectedGallery.images[selectedImageIndex].caption}</p>
                    {selectedGallery.images[selectedImageIndex]?.date && (
                      <p className="text-xs opacity-75 mt-1">
                        {format(new Date(selectedGallery.images[selectedImageIndex].date), 'yyyy年MM月dd日')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}