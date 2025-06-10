import Link from 'next/link'
import Image from 'next/image'
import { Star, Clock, Flame } from 'lucide-react'

const featuredBowls = [
  {
    id: 1,
    name: 'Kampong Table',
    description: 'Roasted lemongrass chicken, mixed grains, basil tofu, onsen egg, oriental cabbage salad, lime wedge with Purple Sweet Potato Dip & Green Goddess',
    price: 16.90,
    rating: 4.8,
    prepTime: '6 mins',
    isPopular: true,
    tags: ['High Protein', 'Asian Fusion'],
    calories: 1048,
    protein: '35g',
    image: '/food/kampong-table.png',
  },
  {
    id: 2,
    name: 'Spice Trade',
    description: 'Falafels, cauliflower lentil rice, fried eggplant, spiced chickpeas, carrot salad, soya crisps with Red Pepper Dip & Tzatziki',
    price: 15.50,
    rating: 4.7,
    prepTime: '5 mins',
    isPopular: false,
    tags: ['Vegetarian', 'Mediterranean'],
    calories: 661,
    protein: '18g',
    image: '/food/spice-trade.png',
  },
  {
    id: 3,
    name: 'Sunday Roast',
    description: 'Char-grilled steak, tri-colour quinoa, roasted pumpkin wedge, charred corn, tomato salad, garlic breadcrumbs with Red Pepper Dip & Balsamic Butter',
    price: 17.90,
    rating: 4.9,
    prepTime: '7 mins',
    isPopular: true,
    tags: ['High Protein', 'Hearty'],
    calories: 785,
    protein: '32g',
    image: '/food/sunday-roast.png',
  },
  {
    id: 4,
    name: 'Shibuya Nights',
    description: 'Baked salmon, green soba, onsen egg, grilled mushrooms, oriental cabbage salad, furikake with Avocado Edamame Dip & Beetroot Miso',
    price: 16.50,
    rating: 4.8,
    prepTime: '6 mins',
    isPopular: false,
    tags: ['Omega-3', 'Japanese'],
    calories: 592,
    protein: '28g',
    image: '/food/shibuya-nights.png',
  },
  {
    id: 5,
    name: 'Gochu-Pop',
    description: 'Sweet potato noodles, gochujang chicken, charred corn, grilled mushrooms, carrot salad, radish pickles with Avocado Edamame Dip & Black Garlic Vinaigrette',
    price: 17.20,
    rating: 4.9,
    prepTime: '7 mins',
    isPopular: true,
    tags: ['Spicy', 'Korean'],
    calories: 768,
    protein: '30g',
    image: '/food/gochu-pop.png',
  },
  {
    id: 6,
    name: 'Muscle Beach',
    description: 'Sous-vide chicken breast, tri-colour quinoa, charred broccoli, carrot salad, avocado, mixed seeds with Purple Sweet Potato Dip & Yuzu Soy',
    price: 18.50,
    rating: 4.9,
    prepTime: '6 mins',
    isPopular: true,
    tags: ['High Protein', 'Fitness'],
    calories: 814,
    protein: '45g',
    image: '/food/muscle-beach.png',
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
                <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
                  <Image
                    src={bowl.image}
                    alt={bowl.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
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
