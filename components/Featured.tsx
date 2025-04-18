import React from 'react'
import { Heart } from 'lucide-react'

function Featured() {
  return (
    <div>
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Featured Products</h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Explore our most popular plant selections and eco-friendly essentials
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Monstera Deliciosa", price: "₹1,299", image: "/api/placeholder/300/300", tag: "Bestseller" },
              { title: "Self-Watering Ceramic Pot", price: "₹899", image: "/api/placeholder/300/300", tag: "New" },
              { title: "Snake Plant", price: "₹749", image: "/api/placeholder/300/300", tag: "Popular" },
              { title: "Organic Plant Food", price: "₹499", image: "/api/placeholder/300/300", tag: "Eco-friendly" }
            ].map((product, index) => (
              <div key={index} className="overflow-hidden rounded-xl border border-gray-100 bg-white transition-all hover:shadow-xl">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="h-64 w-full object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs text-white">
                    {product.tag}
                  </span>
                  <button className="absolute right-4 top-4 rounded-full bg-white p-2 shadow-md hover:bg-gray-50">
                    <Heart className="size-4 text-gray-600" />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-lg font-bold text-gray-900">{product.title}</h3>
                  <p className="mb-4 font-bold text-green-600">{product.price}</p>
                  <button className="w-full rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-800 transition-all hover:bg-green-600 hover:text-white">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <button className="rounded-full border-2 border-green-600 px-8 py-3 font-medium text-green-600 transition-colors hover:bg-green-50">
              View All Products
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Featured
