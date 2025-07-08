import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, Clock } from 'lucide-react';
import { generateSlug, generateExcerpt, calculateReadingTime } from '@/utils/blogUtils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  status: string;
  publish_date: string;
  view_count: number;
  created_at: string;
}

const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    status: 'draft',
    publish_date: ''
  });

  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title && (!formData.slug || !editingPost)) {
      const autoSlug = generateSlug(formData.title);
      setFormData(prev => ({ ...prev, slug: autoSlug }));
    }
  }, [formData.title, editingPost]);

  // Auto-generate excerpt when content changes and excerpt is empty
  useEffect(() => {
    if (formData.content && !formData.excerpt) {
      const autoExcerpt = generateExcerpt(formData.content);
      setFormData(prev => ({ ...prev, excerpt: autoExcerpt }));
    }
  }, [formData.content]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const postData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        content: formData.content,
        excerpt: formData.excerpt || generateExcerpt(formData.content),
        featured_image: formData.featured_image,
        status: formData.status,
        publish_date: formData.publish_date ? new Date(formData.publish_date).toISOString() : null
      };

      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;
        toast({ title: "Success", description: "Blog post updated successfully" });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
        toast({ title: "Success", description: "Blog post created successfully" });
      }

      setShowForm(false);
      setEditingPost(null);
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        title: "Error",
        description: "Failed to save blog post",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content || '',
      excerpt: post.excerpt || '',
      featured_image: post.featured_image || '',
      status: post.status,
      publish_date: post.publish_date ? new Date(post.publish_date).toISOString().split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      toast({ title: "Success", description: "Blog post deleted successfully" });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featured_image: '',
      status: 'draft',
      publish_date: ''
    });
  };

  // Quill editor modules configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'link', 'image', 'align'
  ];

  if (loading) {
    return <div className="text-center py-8">Loading blog posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Blog Manager</h2>
          <p className="text-stone">Create and manage your blog content</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-sage hover:bg-sage/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {showForm && (
        <Card className="bg-cream/30 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-charcoal">{editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
            <CardDescription>
              {editingPost ? 'Update blog post content' : 'Write a new blog post with rich text formatting'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-charcoal">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Enter an engaging blog post title..."
                  />
                  <p className="text-xs text-stone mt-1">
                    {formData.title.length}/80 characters
                  </p>
                </div>
                <div>
                  <Label htmlFor="slug" className="text-charcoal">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Auto-generated from title"
                  />
                  <p className="text-xs text-stone mt-1">
                    Preview: /blog/{formData.slug || 'your-slug-here'}
                  </p>
                </div>
                <div>
                  <Label htmlFor="status" className="text-charcoal">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="publish_date" className="text-charcoal">Publish Date</Label>
                  <Input
                    id="publish_date"
                    type="datetime-local"
                    value={formData.publish_date}
                    onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="featured_image" className="text-charcoal">Featured Image URL</Label>
                <Input
                  id="featured_image"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-charcoal">Content *</Label>
                <div className="mt-2">
                  <ReactQuill
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write your blog post content here. Use the toolbar to format text, add links, and more..."
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      minHeight: '200px'
                    }}
                  />
                </div>
                {formData.content && (
                  <div className="flex items-center gap-4 mt-2 text-sm text-stone">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {calculateReadingTime(formData.content)} min read
                    </span>
                    <span>{formData.content.replace(/<[^>]*>/g, '').length} characters</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="excerpt" className="text-charcoal">Excerpt</Label>
                <Input
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Auto-generated from content or write a custom excerpt..."
                  maxLength={200}
                />
                <p className="text-xs text-stone mt-1">
                  {formData.excerpt.length}/200 characters
                  {!formData.excerpt && formData.content && " (Auto-generated)"}
                </p>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-sage hover:bg-sage/90 text-white">
                  {editingPost ? 'Update Post' : 'Create Post'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPost(null);
                    resetForm();
                  }}
                  className="border-stone text-charcoal hover:bg-cream/50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blush/20 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-charcoal">Blog Posts ({posts.length})</CardTitle>
          <CardDescription>Manage your blog content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex items-center space-x-4">
                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-charcoal">{post.title}</h3>
                    <p className="text-sm text-stone">{post.slug}</p>
                    {post.excerpt && (
                      <p className="text-sm text-stone mt-1 line-clamp-2">{post.excerpt}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={post.status === 'published' ? "default" : post.status === 'draft' ? "secondary" : "outline"}>
                        {post.status}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-stone">
                        <Eye className="h-3 w-3" />
                        <span>{post.view_count || 0}</span>
                      </div>
                      <span className="text-sm text-stone">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(post)}
                    className="border-stone text-charcoal hover:bg-cream/50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <p className="text-center py-8 text-stone">No blog posts found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManager;
