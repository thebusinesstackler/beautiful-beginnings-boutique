
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateReadingTime } from '@/utils/blogUtils';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: blogPost, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Increment view count when post loads
  React.useEffect(() => {
    if (blogPost) {
      const incrementViewCount = async () => {
        await supabase
          .from('blog_posts')
          .update({ view_count: (blogPost.view_count || 0) + 1 })
          .eq('id', blogPost.id);
      };
      incrementViewCount();
    }
  }, [blogPost]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream via-pearl to-blush/30">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-sage border-t-transparent mx-auto mb-6"></div>
            <div className="text-charcoal font-medium text-lg">Loading article...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !blogPost) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream via-pearl to-blush/30">
      <Navigation />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Blog Link */}
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 text-sage hover:text-forest transition-colors duration-300 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Featured Image */}
            {blogPost.featured_image && (
              <div className="relative h-64 md:h-96 overflow-hidden">
                <img 
                  src={blogPost.featured_image} 
                  alt={blogPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent"></div>
              </div>
            )}
            
            {/* Content */}
            <div className="p-8 lg:p-12">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-stone mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-sage" />
                  <span>
                    {new Date(blogPost.publish_date || blogPost.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                {blogPost.content && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-sage" />
                    <span>{calculateReadingTime(blogPost.content)} min read</span>
                  </div>
                )}
                {blogPost.author_id && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-sage" />
                    <span>Author</span>
                  </div>
                )}
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-playfair font-bold text-charcoal mb-6 leading-tight">
                {blogPost.title}
              </h1>
              
              {/* Excerpt */}
              {blogPost.excerpt && (
                <p className="text-xl text-stone leading-relaxed mb-8 font-medium">
                  {blogPost.excerpt}
                </p>
              )}
              
              {/* Content */}
              {blogPost.content && (
                <div 
                  className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:text-charcoal prose-p:text-stone prose-p:leading-relaxed prose-a:text-sage hover:prose-a:text-forest prose-strong:text-charcoal prose-em:text-stone"
                  dangerouslySetInnerHTML={{ __html: blogPost.content }}
                />
              )}
            </div>
          </article>

          {/* Related Posts or Newsletter Signup */}
          <div className="mt-12 bg-gradient-to-r from-sage/10 to-forest/10 rounded-2xl p-8 lg:p-12 text-center">
            <h3 className="text-2xl font-playfair font-bold text-charcoal mb-4">
              Enjoyed this story?
            </h3>
            <p className="text-stone mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter for more heartfelt stories, crafting tips, 
              and updates on new ways to preserve your precious memories.
            </p>
            <button className="bg-sage hover:bg-forest text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300">
              Subscribe to Updates
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
