import Link from 'next/link'
import { Star, Clock, Flame } from 'lucide-react'

const featuredBowls = [
  {
    id: 1,
    name: 'Protein Power Bowl',
    description: 'Quinoa base with grilled chicken, roasted vegetables, and tahini dressing',
    price: 16.90,
    rating: 4.8,
    prepTime: '6 mins',
    isPopular: true,
    tags: ['High Protein', 'Gluten-Free'],
    calories: 520,
    protein: '35g',
  },
  {
    id: 2,
    name: 'Mediterranean Delight',
    description: 'Brown rice with falafel, hummus, cucumber, tomatoes, and tzatziki',
    price: 15.50,
    rating: 4.7,
    prepTime: '5 mins',
    isPopular: false,
    tags: ['Vegetarian', 'Fresh'],
    calories: 480,
    protein: '18g',
  },
  {
    id: 3,
    name: 'Spicy Korean Bowl',
    description: 'Jasmine rice with Korean beef, kimchi, edamame, and gochujang sauce',
    price: 17.90,
    rating: 4.9,
    prepTime: '7 mins',
    isPopular: true,
    tags: ['Spicy', 'Bold Flavors'],
    calories: 580,
    protein: '32g',
  },
]

export default function FeaturedBowls() {
  return (
    <section className="section bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Signature Bowls
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our chef-crafted favorites, loved by thousands. Each bowl is perfectly balanced 
            with fresh ingredients and bold flavors.
          </p>
        </div>

        {/* Bowls Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredBowls.map((bowl) => (
            <div key={bowl.id} className="bowl-card group">
              {/* Bowl Image */}
              <div className="relative mb-6">
                <div className="w-full h-48 bg-gradient-to-br from-brown-200 via-brown-300 to-brown-400 rounded-xl flex items-center justify-center">
                  <div className="text-center text-brown-700">
                    <span className="text-4xl mb-2 block">🍲</span>
                    <p className="text-sm font-medium">{bowl.name}</p>
                  </div>
                </div>
                
                {/* Popular badge */}
                {bowl.isPopular && (
                  <div className="absolute top-3 left-3 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <Flame className="w-3 h-3" />
                    <span>Popular</span>
                  </div>
                )}
                
                {/* Quick add button */}
                <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white">
                  <span className="text-lg">+</span>
                </button>
              </div>

              {/* Bowl Info */}
              <div className="space-y-4">
                {/* Name and Rating */}
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                    {bowl.name}
                  </h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{bowl.rating}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {bowl.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {bowl.tags.map((tag) => (
                    <span key={tag} className="ingredient-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Nutrition Info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>{bowl.calories} cal</span>
                    <span>{bowl.protein} protein</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{bowl.prepTime}</span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="price-tag">
                    ${bowl.price.toFixed(2)}
                  </span>
                  <button className="btn btn-primary btn-sm">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link href="/menu" className="btn btn-outline btn-lg">
            View All Bowls
          </Link>
        </div>
      </div>
    </section>
  )
}
