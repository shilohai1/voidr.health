// Optimized blog service for handling thousands of blog posts
import { getAllBlogPosts as getAllBlogPostsDynamic, BlogPost } from './blogLoader';
export type { BlogPost } from './blogLoader';

// BlogPost interface is now imported from blogLoader

// In-memory cache for better performance

let cachedPosts: BlogPost[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Async function to get all posts with caching
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const now = Date.now();
  if (cachedPosts && (now - lastCacheTime) < CACHE_DURATION) {
    return cachedPosts;
  }
  cachedPosts = (await getAllBlogPostsDynamic()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  lastCacheTime = now;
  return cachedPosts;
}

// Async pagination function
export async function getBlogPostsPaginated(page: number = 1, limit: number = 12) {
  const allPosts = await getAllBlogPosts();
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

// Async: Get posts by category with pagination
export async function getBlogPostsByCategory(category: string, page: number = 1, limit: number = 12) {
  const allPosts = await getAllBlogPosts();
  let filtered;
  if (category === "All") {
    filtered = allPosts;
  } else {
    filtered = allPosts.filter(post => (post.category || '').trim().toLowerCase() === category.trim().toLowerCase());
  }
  // Fallback: if no posts found, show all
  if (filtered.length === 0) filtered = allPosts;
  const totalPosts = filtered.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return {
    posts: filtered.slice(startIndex, endIndex),
    totalPages,
    totalPosts,
    currentPage: page
  };
}

// Async: Search posts by title, excerpt, or content
export async function searchBlogPosts(query: string, page: number = 1, limit: number = 12) {
  const allPosts = await getAllBlogPosts();
  const filtered = allPosts.filter(post =>
    post.title.toLowerCase().includes(query.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
    post.content.toLowerCase().includes(query.toLowerCase())
  );
  const totalPosts = filtered.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return {
    posts: filtered.slice(startIndex, endIndex),
    totalPages,
    totalPosts,
    currentPage: page
  };
}

// Async: Get single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const allPosts = await getAllBlogPosts();
  console.log('[blogService] Looking for slug:', slug, 'Available slugs:', allPosts.map(p => p.slug));
  return allPosts.find(post => post.slug === slug) || null;
}

// Async: Get featured posts
export async function getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter(post => post.featured).slice(0, limit);
}

// Async: Get recent posts
export async function getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.slice(0, limit);
}

// Async: Get all categories
export async function getAllCategories(): Promise<string[]> {
  const allPosts = await getAllBlogPosts();
  const categories = new Set(allPosts.map(post => post.category));
  return ["All", ...Array.from(categories).sort()];
}

// Clear cache (useful when adding new posts)
export function clearBlogCache(): void {
  cachedPosts = null;
  lastCacheTime = 0;
}
