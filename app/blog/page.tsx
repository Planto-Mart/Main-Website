"use client";
import { useState } from 'react';

import BlogFilters from '@/components/Blog/Blog-Filters';
import BlogGrid from '@/components/Blog/Blog-Grid';
import BlogHeader from '@/components/Blog/Blog-Header';
import BlogSidebar from '@/components/Blog/Blog-Sidebar';
import FeaturedPost from '@/components/Blog/Featured-Post';
import NewsletterSection from '@/components/Blog/Newsletter';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <BlogHeader />
      <FeaturedPost />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <BlogFilters 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            <BlogGrid selectedCategory={selectedCategory} searchTerm={searchTerm} />
          </div>
          <div className="lg:col-span-1">
            <BlogSidebar />
          </div>
        </div>
      </div>
      <NewsletterSection />
    </div>
    <Footer/>
    </>
  );
};

export default BlogPage;