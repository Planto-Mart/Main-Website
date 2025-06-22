import BlogCard from "./Blog-Card";

const BlogGrid = ({ selectedCategory, searchTerm }:{selectedCategory:any , searchTerm:any}) => {
  const blogPosts = [
    {
      id: 1,
      title: "10 Best Low-Light Plants for Your Home Office",
      excerpt: "Discover the perfect plants that thrive in low-light conditions and boost your productivity.",
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=250&fit=crop",
      author: "Emma Wilson",
      date: "3 days ago",
      readTime: "8 min read",
      category: "indoor-plants",
      views: 8500,
      likes: 1200,
      featured: false
    },
    {
      id: 2,
      title: "How to Build a Successful Plant Business: Vendor Success Stories",
      excerpt: "Learn from top vendors on our platform about building and scaling a profitable plant business.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop",
      author: "Michael Chen",
      date: "5 days ago",
      readTime: "15 min read",
      category: "vendor-tips",
      views: 12300,
      likes: 2800,
      featured: true
    },
    {
      id: 3,
      title: "Spring Plant Care Checklist: Prepare Your Garden",
      excerpt: "Essential tasks to ensure your plants thrive as the seasons change.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop",
      author: "Lisa Rodriguez",
      date: "1 week ago",
      readTime: "10 min read",
      category: "seasonal",
      views: 6700,
      likes: 945,
      featured: false
    },
    {
      id: 4,
      title: "Common Plant Problems and How to Fix Them",
      excerpt: "Troubleshoot yellow leaves, wilting, and pest issues with expert solutions.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop",
      author: "David Park",
      date: "1 week ago",
      readTime: "12 min read",
      category: "troubleshooting",
      views: 9100,
      likes: 1500,
      featured: false
    },
    {
      id: 5,
      title: "Creating a Thriving Indoor Herb Garden",
      excerpt: "Grow fresh herbs year-round with these practical tips and techniques.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop",
      author: "Rachel Green",
      date: "2 weeks ago",
      readTime: "9 min read",
      category: "gardening",
      views: 7200,
      likes: 1100,
      featured: false
    },
    {
      id: 6,
      title: "The Science Behind Plant Growth: Understanding Photosynthesis",
      excerpt: "Dive deep into how plants convert light into energy and what it means for care.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop",
      author: "Dr. Alex Johnson",
      date: "2 weeks ago",
      readTime: "18 min read",
      category: "plant-care",
      views: 5400,
      likes: 823,
      featured: false
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {filteredPosts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
};


export default BlogGrid;