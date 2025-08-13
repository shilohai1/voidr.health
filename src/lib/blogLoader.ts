import fm from 'front-matter';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author?: string;
  [key: string]: any;
}

// Vite's import.meta.glob for markdown files
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const modules = import.meta.glob('/src/blogs/*.md', { as: 'raw', eager: true }) as Record<string, string>;
  console.log('[blogLoader] Matched markdown files:', Object.keys(modules));
  const posts: BlogPost[] = [];

  for (const path in modules) {
    const raw = modules[path];
    const { attributes, body: content } = fm(raw);
    const data = attributes as Record<string, any>;
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    console.log('[blogLoader] Generated slug:', slug, 'from path:', path);
    posts.push({
      slug,
      title: data.title || '',
      excerpt: data.excerpt || '',
      content,
      date: data.date || '',
      author: data.author || '',
      category: typeof data.category === 'string' ? data.category.trim() : '',
      readTime: data.readTime || '',
      ...data
    });
  }

  // Sort by date descending
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}
