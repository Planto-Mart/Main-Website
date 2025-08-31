"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Tag, Eye, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import Footer from '../Footer';
import Navbar from '../Navbar';
import Link from 'next/link';

// Interface for blog data
interface BlogData {
  id: number;
  blogId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  authorName: string;
  authorId: string;
  featuredImage: string;
  isFeatured: boolean;
  isPublished: boolean;
  views: number;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: BlogData;
}

interface CompletePageProps {
  slug?: string; // Make slug optional with default for demo
}

// Simple markdown to HTML converter
const convertMarkdownToHTML = (markdown: string): string => {
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mb-6 mt-8">$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm">$1</code></pre>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
    
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4">$1</blockquote>')
    
    // Lists
    .replace(/^\- (.*$)/gim, '<li class="ml-4 mb-2">$1</li>')
    .replace(/(<li[^>]*>[\s\S]*?<\/li>)/, '<ul class="list-disc list-inside my-4">$1</ul>')
    
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, '<br/>')
    
    // Horizontal rules
    .replace(/^---$/gim, '<hr class="border-t border-gray-300 my-8"/>')
    
    // Wrap in paragraphs
    .replace(/^(?!<[h1-6]|<ul|<ol|<pre|<blockquote|<hr)(.+)/gm, '<p class="mb-4">$1</p>');
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    return dateString;
  }
};

const CompletePage: React.FC<CompletePageProps> = ({ slug = "productivity-hacks-developers" }) => {
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) {
        setError('Blog slug is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://backend-server.developer-plantomart.workers.dev/blog/get/${encodeURIComponent(slug)}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Blog post not found');
          } else if (response.status >= 500) {
            throw new Error('Server error. Please try again later.');
          } else {
            throw new Error(`Error: ${response.status}`);
          }
        }

        const result: ApiResponse = await response.json();

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch blog post');
        }

        if (!result.data) {
          throw new Error('No blog data received');
        }

        setBlog(result.data);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err instanceof Error ? err.message : 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-64 bg-gray-300 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Blog</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No blog data
  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Blog Not Found</h2>
          <p className="text-gray-600">The requested blog post could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
        <Link href="/blog">
          <div 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Blog</span>
          </div>
        </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="mb-8">
            <img 
              src={blog.featuredImage} 
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Blog Header */}
        <header className="mb-8">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {blog.category}
            </span>
            {blog.isFeatured && (
              <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full ml-2">
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {blog.title}
          </h1>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{blog.authorName}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{Math.ceil(blog.content.length / 1000)} min read</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Eye size={16} />
              <span>{blog.views.toLocaleString()} views</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Share2 size={16} />
              Share
            </button>
            <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
              <Bookmark size={16} />
              Save
            </button>
          </div>
        </header>

        {/* Blog Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: convertMarkdownToHTML(blog.content) 
            }}
          />
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Tag size={20} />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Author</h3>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {blog.authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{blog.authorName}</h4>
              {blog.authorId && (
                <p className="text-gray-600 text-sm">{blog.authorId}</p>
              )}
              <p className="text-gray-600 text-sm mt-1">
                Content creator passionate about sharing knowledge and helping developers grow.
              </p>
            </div>
          </div>
        </div>

        {/* Blog Metadata (for debugging/admin) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 rounded-lg p-4 text-xs text-gray-600">
            <h4 className="font-semibold mb-2">Debug Info:</h4>
            <p>Blog ID: {blog.blogId}</p>
            <p>Slug: {blog.slug}</p>
            <p>Created: {blog.createdAt}</p>
            <p>Updated: {blog.updatedAt}</p>
            <p>Published: {blog.isPublished ? 'Yes' : 'No'}</p>
            <p>Featured: {blog.isFeatured ? 'Yes' : 'No'}</p>
          </div>
        )}
      </article>

      {/* SEO Meta (would be handled by Next.js Head or similar in real app) */}
      <div style={{ display: 'none' }}>
        <title>{blog.seoTitle || blog.title}</title>
        <meta name="description" content={blog.seoDescription || blog.excerpt} />
        <meta property="og:title" content={blog.seoTitle || blog.title} />
        <meta property="og:description" content={blog.seoDescription || blog.excerpt} />
        {blog.featuredImage && <meta property="og:image" content={blog.featuredImage} />}
      </div>
    </div>
    <Footer/>
    </>
  );
};

// Demo component that shows the blog page in action
const BlogPageDemo: React.FC = () => {
  const [currentSlug, setCurrentSlug] = useState('productivity-hacks-developers');
  const [customSlug, setCustomSlug] = useState('');

  const handleSlugChange = () => {
    if (customSlug.trim()) {
      setCurrentSlug(customSlug.trim());
      setCustomSlug('');
    }
  };

  return (
    <div>
      {/* Demo Controls */}
      <div className="bg-blue-50 border-b border-blue-200 p-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Blog Page Demo</h2>
          <div className="flex gap-3 items-center">
            <span className="text-sm text-blue-700">Current slug:</span>
            <span className="bg-blue-100 px-2 py-1 rounded text-sm font-mono">{currentSlug}</span>
            <input
              type="text"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder="Enter different slug..."
              className="border border-blue-300 rounded px-3 py-1 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleSlugChange()}
            />
            <button
              onClick={handleSlugChange}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Load
            </button>
          </div>
        </div>
      </div>

      {/* Blog Page */}
      <CompletePage slug={currentSlug} />
    </div>
  );
};

export default CompletePage;;