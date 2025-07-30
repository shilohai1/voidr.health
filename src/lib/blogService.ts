// Optimized blog service for handling thousands of blog posts
import { blogPosts } from './blogData';

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  featured?: boolean;
}

// In-memory cache for better performance
let cachedPosts: BlogPost[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to get all posts with caching
export function getAllBlogPosts(): BlogPost[] {
  const now = Date.now();
  
  // Use cache if available and fresh
  if (cachedPosts && (now - lastCacheTime) < CACHE_DURATION) {
    return cachedPosts;
  }
  
  // Refresh cache
  cachedPosts = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  lastCacheTime = now;
  
  return cachedPosts;
}

// Optimized pagination function
export function getBlogPostsPaginated(page: number = 1, limit: number = 12): {
  posts: BlogPost[];
  totalPages: number;
  totalPosts: number;
  currentPage: number;
} {
  const allPosts = getAllBlogPosts();
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    posts: allPosts.slice(startIndex, endIndex),
    totalPages,
    totalPosts,
    currentPage: page
  };
}

// Get posts by category with pagination
export function getBlogPostsByCategory(category: string, page: number = 1, limit: number = 12): {
  posts: BlogPost[];
  totalPages: number;
  totalPosts: number;
  currentPage: number;
} {
  const allPosts = getAllBlogPosts();
  const filteredPosts = category === "All" ? allPosts : allPosts.filter(post => post.category === category);
  
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    posts: filteredPosts.slice(startIndex, endIndex),
    totalPages,
    totalPosts,
    currentPage: page
  };
}

// Search posts with pagination
export function searchBlogPosts(query: string, page: number = 1, limit: number = 12): {
  posts: BlogPost[];
  totalPages: number;
  totalPosts: number;
  currentPage: number;
} {
  const allPosts = getAllBlogPosts();
  const lowercaseQuery = query.toLowerCase();
  
  const filteredPosts = allPosts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.author.toLowerCase().includes(lowercaseQuery) ||
    post.category.toLowerCase().includes(lowercaseQuery)
  );
  
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    posts: filteredPosts.slice(startIndex, endIndex),
    totalPages,
    totalPosts,
    currentPage: page
  };
}

// Get single blog post by ID
export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const allPosts = getAllBlogPosts();
  return allPosts.find(post => post.id === id) || null;
}

// Get featured posts
export function getFeaturedPosts(limit: number = 3): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter(post => post.featured).slice(0, limit);
}

// Get recent posts
export function getRecentPosts(limit: number = 5): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.slice(0, limit);
}

// Get all categories
export function getAllCategories(): string[] {
  const allPosts = getAllBlogPosts();
  const categories = new Set(allPosts.map(post => post.category));
  return ["All", ...Array.from(categories).sort()];
}

// Clear cache (useful when adding new posts)
export function clearBlogCache(): void {
  cachedPosts = null;
  lastCacheTime = 0;
}