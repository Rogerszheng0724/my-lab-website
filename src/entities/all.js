// src/entities/all.js

// 為了模擬，我們先在記憶體中建立假資料庫
let db = {
  teachers: [
    { id: 1, name: '陳建宏', title: '指導教授', email: 'chchen@test.com', office: '電資大樓 707室', bio: '專長於機器學習與資料探勘...', is_primary: true, photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop' }
  ],
  members: [
    { id: 1, name: '王小明', position: '碩士生', status: '在學', year: '2023', research_topic: '深度學習應用' },
    { id: 2, name: '李美麗', position: '博士生', status: '在學', year: '2021', research_topic: '自然語言處理' }
  ],
  publications: [
    { id: 1, title: '一個新的演算法', authors: '陳建宏, 王小明', journal: 'IEEE Transactions', year: 2024, type: '期刊論文' }
  ],
  research: [
      { id: 1, title: 'AI於醫療影像的應用', description: '本研究旨在利用深度學習模型分析醫療影像...', type: '研究方向', status: '進行中' }
  ],
  courses: [
    { id: 1, title: '機器學習導論', code: 'CS501', semester: '1', year: 2023, credits: 3, level: '碩士班', instructor: '陳建宏' }
  ],
  awards: [
    { id: 1, title: '最佳論文獎', recipient: '王小明', organization: '全國計算機會議', year: 2023, category: '學生獎項' }
  ],
  galleries: [
      { id: 1, title: '2023 實驗室尾牙', description: '年度實驗室聚餐', cover_image_url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&h=300&fit=crop', images: [], event_date: '2023-12-31', category: '實驗室活動' }
  ],
  contacts: [
      { id: 1, lab_name: '多媒體機器學習實驗室', department: '資訊管理學系', university: '國立中央大學', address: '320桃園市中壢區中大路300號', phone: ' 03-4227151 #66500', email: 'swgke@ncu.edu.tw', latitude: 24.9678, longitude: 121.1915 }
  ]
};

// 輔助函式，用來產生唯一的 ID
const getNextId = (collection) => {
  return collection.length > 0 ? Math.max(...collection.map(item => item.id)) + 1 : 1;
};

// 通用的 CRUD (Create, Read, Update, Delete) 產生器
const createEntity = (entityName) => {
  const collection = db[entityName];
  return {
    // 列表 (Read all)
    list: async (sort, limit) => {
        // 這是一個簡化版，您可以擴充排序和限制功能
        return [...collection];
    },
    // 篩選 (Read with filter)
    filter: async (filters, sort, limit) => {
        return collection.filter(item => {
            return Object.keys(filters).every(key => item[key] === filters[key]);
        });
    },
    // 新增 (Create)
    create: async (data) => {
      const newItem = { ...data, id: getNextId(collection) };
      collection.push(newItem);
      return newItem;
    },
    // 更新 (Update)
    update: async (id, data) => {
      const index = collection.findIndex(item => item.id === id);
      if (index !== -1) {
        collection[index] = { ...collection[index], ...data };
        return collection[index];
      }
      return null;
    },
    // 刪除 (Delete)
    delete: async (id) => {
      const index = collection.findIndex(item => item.id === id);
      if (index !== -1) {
        collection.splice(index, 1);
        return true;
      }
      return false;
    }
  };
};

// 匯出所有實體的 API
export const Teacher = createEntity('teachers');
export const Member = createEntity('members');
export const Publication = createEntity('publications');
export const Research = createEntity('research');
export const Course = createEntity('courses');
export const Award = createEntity('awards');
export const Gallery = createEntity('galleries');
export const Contact = createEntity('contacts');