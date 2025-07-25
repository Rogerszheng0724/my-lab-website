// src/utils.js

const pageUrls = {
  Home: '/',
  Members: '/members',
  Research: '/research',
  Publications: '/publications',
  Courses: '/courses',
  Awards: '/awards',
  Gallery: '/gallery',
  Contact: '/contact',
  
  Admin: '/admin',
  AdminMembers: '/admin/members',
  AdminResearch: '/admin/research',
  AdminPublications: '/admin/publications',
  AdminCourses: '/admin/courses',
  AdminAwards: '/admin/awards',
  AdminGallery: '/admin/gallery',
  AdminContact: '/admin/contact',
};

export const createPageUrl = (pageName) => {
  return pageUrls[pageName] || '/';
};