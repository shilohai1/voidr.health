import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, User, ArrowRight, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import { getBlogPostsByCategory, searchBlogPosts, getAllCategories, type BlogPost } from "@/lib/blogService";



// Categories will be loaded dynamically

const POSTS_PER_PAGE = 12;

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  // Load blog posts and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load categories
        const availableCategories = await getAllCategories();
        setCategories(availableCategories);
        // Load posts based on search or category
        let result;
        if (searchQuery) {
          result = await searchBlogPosts(searchQuery, currentPage, POSTS_PER_PAGE);
        } else {
          result = await getBlogPostsByCategory(selectedCategory, currentPage, POSTS_PER_PAGE);
        }
        setBlogPosts(result.posts);
        setTotalPages(result.totalPages);
        setTotalPosts(result.totalPosts);
        console.log('Loaded blog posts:', result.posts);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedCategory, currentPage, searchQuery]);

  // Debug: log blogPosts every render
  useEffect(() => {
    console.log('[Blog UI] blogPosts state:', blogPosts);
  }, [blogPosts]);

  // Posts are already filtered and paginated by the service
  const paginatedPosts = blogPosts;

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#89ebf5] to-white dark:from-gray-900 dark:to-gray-800">
      {/* VOIDR Logo */}
      <div className="absolute top-6 right-6 z-50">
        <a 
          href="/" 
          className="hover:opacity-80 transition-opacity"
        >
          <picture>
            <source srcSet="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.webp" type="image/webp" />
            <img 
              src="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.png" 
              alt="VOIDR" 
              className="h-12 w-auto"
            />
          </picture>
        </a>
      </div>

      {/* Simple Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-[#036873] dark:text-white mb-6">
            VOIDR Blogs & Articles
          </h1>
          <p className="text-xl text-[#036873] dark:text-white mb-6 max-w-3xl mx-auto">
            Stay updated with the latest and updated Articles and Blogs in AI-powered medical education, 
            clinical technology, and Public Health.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search articles by title..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Badge 
              key={category} 
              variant={selectedCategory === category ? "default" : "secondary"}
              className={`px-4 py-2 cursor-pointer transition-colors ${
                selectedCategory === category 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-primary hover:text-primary-foreground"
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-[#036873] text-xl">Loading blog posts...</div>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-[#036873] text-xl">No blog posts found.</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {paginatedPosts.map((post) => (
              <motion.div
                key={`${post.slug}-${selectedCategory}-${currentPage}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                  <CardHeader className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <span className="text-sm text-[#036873]">{post.readTime}</span>
                    </div>
                    <CardTitle className="group-hover:text-blue-600 transition-colors text-lg line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="text-xs">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          <span className="text-xs">{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <Link to={`/blog/${post.slug}`} className="block mt-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full group-hover:bg-blue-50 group-hover:text-blue-600"
                        >
                          Read Full Article
                          <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </motion.div>
                    </Link>
                  </CardContent>
                </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-10 h-10"
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}



        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link to="/">
            <Button variant="outline" className="group">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

