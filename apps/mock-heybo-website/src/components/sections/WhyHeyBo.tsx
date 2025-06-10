import { Leaf, Clock, Heart, Sparkles, Shield, Users } from 'lucide-react'

const features = [
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    description: 'Sourced daily from local farms and suppliers. No preservatives, just pure goodness.',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    icon: Clock,
    title: 'Quick & Convenient',
    description: 'Ready in 5-7 minutes. Perfect for busy lifestyles without compromising on quality.',
    color: 'text-primary-500',
    bgColor: 'bg-primary-50',
  },
  {
    icon: Heart,
    title: 'Nutritionally Balanced',
    description: 'Each bowl is crafted to provide optimal nutrition with the right balance of macros.',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  {
    icon: Sparkles,
    title: 'Fully Customizable',
    description: 'Build your perfect bowl with endless combinations of bases, proteins, and toppings.',
    color: 'text-secondary-500',
    bgColor: 'bg-secondary-50',
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'Rigorous quality standards and food safety protocols ensure every bowl meets our high standards.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Users,
    title: 'Community Focused',
    description: 'Supporting local communities and sustainable practices while serving delicious food.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
]

export default function WhyHeyBo() {
  return (
    <section className="section bg-gray-50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose HeyBo?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're more than just a grain bowl company. We're committed to providing 
            wholesome, delicious meals that fuel your body and satisfy your taste buds.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={feature.title} 
                className="bg-white rounded-xl p-8 shadow-soft hover:shadow-medium transition-shadow duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-soft">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary-600">50K+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary-600">15+</div>
              <div className="text-sm text-gray-600">Locations</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary-600">100+</div>
              <div className="text-sm text-gray-600">Ingredient Options</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary-600">4.8★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-primary rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Build Your Perfect Bowl?
            </h3>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have made HeyBo their go-to choice 
              for healthy, delicious meals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Start Building
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold transition-all duration-200">
                View Locations
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
