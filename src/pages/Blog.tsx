
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateReadingTime } from '@/utils/blogUtils';

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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream via-pearl to-blush/30">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-sage border-t-transparent mx-auto mb-6"></div>
            <div className="text-charcoal font-medium text-lg">Loading our latest stories...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream via-pearl to-blush/30">
      <Navigation />
      
      <main className="flex-1 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Header */}
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-sage/10 rounded-full mb-6">
              <span className="text-sage font-medium text-sm uppercase tracking-wide">Our Blog</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-charcoal mb-6 leading-tight">
              Stories of Love & 
              <span className="text-sage block">Remembrance</span>
            </h1>
            <p className="text-xl text-stone max-w-3xl mx-auto leading-relaxed">
              Discover the inspiration behind our handcrafted keepsakes, customer stories, 
              and the artistry that goes into creating meaningful memories.
            </p>
          </div>

          {/* Blog Posts */}
          {blogPosts && blogPosts.length > 0 ? (
            <div className="space-y-16">
              {/* Featured Post (First Post) */}
              {blogPosts.length > 0 && (
                <article className="group featured-post">
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden lg:grid lg:grid-cols-2 lg:gap-0">
                    {/* Featured Image */}
                    {blogPosts[0].featured_image && (
                      <div className="relative overflow-hidden lg:order-2 h-64 lg:h-full">
                        <img 
                          src={blogPosts[0].featured_image} 
                          alt={blogPosts[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent"></div>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="p-8 lg:p-12 lg:order-1">
                      {/* Meta Information */}
                      <div className="flex items-center gap-6 text-sm text-stone mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-sage" />
                          <span>
                            {new Date(blogPosts[0].publish_date || blogPosts[0].created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        {blogPosts[0].content && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-sage" />
                            <span>{calculateReadingTime(blogPosts[0].content)} min read</span>
                          </div>
                        )}
                        {blogPosts[0].author_id && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-sage" />
                            <span>Author</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Title */}
                      <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-charcoal mb-4 group-hover:text-sage transition-colors duration-300">
                        <Link to={`/blog/${blogPosts[0].slug}`} className="hover:underline decoration-sage decoration-2 underline-offset-4">
                          {blogPosts[0].title}
                        </Link>
                      </h2>
                      
                      {/* Excerpt */}
                      {blogPosts[0].excerpt && (
                        <p className="text-lg text-stone leading-relaxed mb-6">
                          {blogPosts[0].excerpt}
                        </p>
                      )}
                      
                      {/* Read More Link */}
                      <Link 
                        to={`/blog/${blogPosts[0].slug}`}
                        className="inline-flex items-center gap-2 text-sage hover:text-chocolate font-medium transition-all duration-300 group-hover:gap-3"
                      >
                        Continue reading
                        <ArrowRight className="h-4 w-4 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </article>
              )}

              {/* Two-Column Grid for Remaining Posts */}
              {blogPosts.length > 1 && (
                <div className="grid md:grid-cols-2 gap-8">
                  {blogPosts.slice(1).map((post) => (
                    <article key={post.id} className="group">
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                        {/* Featured Image */}
                        {post.featured_image && (
                          <div className="relative overflow-hidden h-48">
                            <img 
                              src={post.featured_image} 
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent"></div>
                          </div>
                        )}
                        
                        {/* Content */}
                        <div className="p-6">
                          {/* Meta Information */}
                          <div className="flex items-center gap-4 text-sm text-stone mb-4 flex-wrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-sage" />
                              <span>
                                {new Date(post.publish_date || post.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            {post.content && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-sage" />
                                <span>{calculateReadingTime(post.content)} min read</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Title */}
                          <h2 className="text-xl lg:text-2xl font-playfair font-bold text-charcoal mb-3 group-hover:text-sage transition-colors duration-300">
                            <Link to={`/blog/${post.slug}`} className="hover:underline decoration-sage decoration-2 underline-offset-4">
                              {post.title}
                            </Link>
                          </h2>
                          
                          {/* Excerpt */}
                          {post.excerpt && (
                            <p className="text-stone leading-relaxed mb-4 text-sm">
                              {post.excerpt}
                            </p>
                          )}
                          
                          {/* Read More Link */}
                          <Link 
                            to={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-2 text-sage hover:text-chocolate font-medium transition-all duration-300 group-hover:gap-3 text-sm"
                          >
                            Continue reading
                            <ArrowRight className="h-4 w-4 transition-transform duration-300" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-8 bg-sage/10 rounded-full flex items-center justify-center">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-2xl font-playfair font-semibold text-charcoal mb-4">
                Our Story Is Just Beginning
              </h3>
              <p className="text-lg text-stone max-w-md mx-auto">
                We're crafting beautiful stories to share with you. 
                Check back soon for inspiring tales and heartfelt moments.
              </p>
            </div>
          )}

          {/* Newsletter Signup */}
          {blogPosts && blogPosts.length > 0 && (
            <div className="mt-20 bg-gradient-to-r from-sage/10 to-forest/10 rounded-2xl p-8 lg:p-12 text-center">
              <h3 className="text-2xl font-playfair font-bold text-charcoal mb-4">
                Stay Connected
              </h3>
              <p className="text-stone mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter and be the first to read our latest stories, 
                get crafting tips, and discover new ways to preserve your precious memories.
              </p>
              <button className="bg-sage hover:bg-forest text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300">
                Subscribe to Updates
              </button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
