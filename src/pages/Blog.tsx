
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('publish_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream to-pearl">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent mx-auto mb-4"></div>
            <div className="text-charcoal font-medium">Loading blog posts...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream to-pearl">
      <Navigation />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-charcoal mb-4">Our Blog</h1>
            <p className="text-lg text-stone max-w-2xl mx-auto">
              Stories, inspiration, and behind-the-scenes glimpses into creating beautiful, personalized keepsakes.
            </p>
          </div>

          {/* Blog Posts Grid */}
          {blogPosts && blogPosts.length > 0 ? (
            <div className="grid gap-8 md:gap-12">
              {blogPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="md:flex">
                    {post.featured_image && (
                      <div className="md:w-1/3">
                        <img 
                          src={post.featured_image} 
                          alt={post.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                    )}
                    <div className={`p-6 ${post.featured_image ? 'md:w-2/3' : 'w-full'}`}>
                      <div className="flex items-center text-sm text-stone mb-3">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(post.publish_date || post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {post.author_id && (
                          <>
                            <span className="mx-2">•</span>
                            <User className="h-4 w-4 mr-1" />
                            Author
                          </>
                        )}
                      </div>
                      
                      <h2 className="text-2xl font-bold text-charcoal mb-3 hover:text-chocolate transition-colors duration-200">
                        {post.title}
                      </h2>
                      
                      {post.excerpt && (
                        <p className="text-stone mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center text-sage hover:text-chocolate font-medium transition-colors duration-200"
                      >
                        Read more
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">No blog posts yet</h3>
              <p className="text-stone">Check back soon for inspiring stories and updates!</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
