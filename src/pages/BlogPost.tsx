// src/pages/BlogPost.tsx
import { useParams, Link } from "react-router-dom";
import { CalendarDays, Clock, User, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { VoidrProductCard } from "@/components/ui/voidr-product-card";
import Footer from "@/components/Footer";
import { getBlogPostBySlug, type BlogPost } from "@/lib/blogService";
import { useEffect, useState } from "react";
import { marked } from "marked";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const loadedPost = await getBlogPostBySlug(slug);
        setPost(loadedPost);
      } catch (error) {
        console.error('Error loading blog post:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-blue-600 text-xl">
        Loading blog post...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-red-500 text-xl">
        Blog post not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#236dcf] to-white">
      {/* VOIDR Logo */}
      <div className="absolute top-6 right-6 z-50">
        <a href="/" className="hover:opacity-80 transition-opacity">
          <picture>
            <source srcSet="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.webp" type="image/webp" />
            <img src="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.png" alt="VOIDR" className="h-12 w-auto" />
          </picture>
        </a>
      </div>

      <div className="px-4 py-12 w-full flex flex-col items-center justify-center">
        <div className="w-full sm:max-w-3xl mx-auto flex flex-col items-center justify-center">
          {/* Back Button */}
          <div className="mb-6 w-full">
            <Link to="/blog" className="inline-flex items-center bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>
          </div>

          {/* Post Header */}
          <div className="mb-8 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg">
            <Badge className="mb-4 bg-white/20 text-white border-white/20">
              {post.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-4 text-left">{post.title}</h1>
            <p className="text-blue-100 text-lg mb-6 text-left">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-6 text-blue-100 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Full Content - perfectly centered, black text, tighter line spacing, left-aligned headings */}
          <div className="w-full sm:max-w-3xl mx-auto">
            <div
              className="bg-[#e6f2f0] rounded-2xl shadow-xl p-6 sm:p-8 mb-8 text-black text-lg leading-[1.5] w-full"
              style={{ textAlign: 'left' }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: marked.parse(post.content || "") }}
                className="prose prose-lg prose-headings:text-left prose-p:leading-tight prose-p:my-1 mx-auto px-2 sm:px-6"
              />
            </div>
          </div>

          {/* Disclaimer box - now outside the content box, above the product card */}
          <div className="w-full sm:max-w-3xl mx-auto mt-2 mb-12">
            <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-6 flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-yellow-800 text-base">
                This content is for informational purposes only and is not intended as medical advice. Always consult with a qualified healthcare provider for diagnosis, treatment, and personalized medical recommendations.
              </span>
            </div>
          </div>

          {/* VOIDR Health Product Card */}
          <div className="mt-0 w-full sm:max-w-3xl mx-auto flex flex-col items-center">
            {/* VOIDR Logo with gradient background and hover */}
            <div className="w-full flex justify-center mb-4">
              <div className="rounded-2xl p-2 transition-all duration-300 bg-gradient-to-r from-[#AEAEEE] to-[#94BBE9] hover:scale-105 shadow-lg">
                <picture>
                  <source srcSet="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.webp" type="image/webp" />
                  <img src="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.png" alt="VOIDR" className="h-12 w-auto" />
                </picture>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-6 text-center text-white">
              Discover VOIDR Health
            </h3>
            {/* Product Card without the 'Video Generation - Educational Content Creation' line */}
            <div className="w-full">
              <VoidrProductCard hideVideoGenLine />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
