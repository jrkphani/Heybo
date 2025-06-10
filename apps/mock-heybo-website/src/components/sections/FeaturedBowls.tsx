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
    <section className="section bg-gradient-to-b from-orange-50 to-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-orange-600 mb-4">
            SEASONAL BO!
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Click on each item to view the nutritional information.
          </p>

          {/* Filter buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button className="px-6 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors">
              All categories
            </button>
            <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors">
              Drinks
            </button>
            <button className="px-6 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors">
              Bowl
            </button>
          </div>
        </div>

        {/* Bowls Grid - Only show first 2 bowls to match the design */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {featuredBowls.slice(0, 2).map((bowl, index) => (
            <div key={bowl.id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              {/* Bowl Image */}
              <div className="relative">
                <div className="w-full h-64 bg-gray-100 overflow-hidden">
                  <Image
                    src={bowl.image}
                    alt={bowl.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* NEW badge */}
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  NEW
                </div>
              </div>

              {/* Bowl Info */}
              <div className="p-6">
                {/* Name and Rating */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-xl">
                    {index === 0 ? 'Tori Sasaki' : 'Una Umai'}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{index === 0 ? '4.5' : '3.7'}</span>
                  </div>
                </div>

                {/* Allergen info */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-600">1 allergen</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {bowl.description.substring(0, 100)}...
                </p>

                {/* Price */}
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">
                    {index === 0 ? '45.5' : '37.4'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nutritional Calculator Section */}
        <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-3xl p-8 md:p-12 text-center text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            NUTRITIONAL CALCULATOR
          </h3>
          <p className="text-lg mb-8 opacity-90">
            Calculate the nutritional value of your custom bowl
          </p>
          <div className="relative max-w-2xl mx-auto">
            <Image
              src="/food/sunday-roast.png"
              alt="Nutritional Calculator Bowl"
              width={600}
              height={300}
              className="w-full h-48 object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
              <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-100 transition-colors">
                Try Calculator
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
