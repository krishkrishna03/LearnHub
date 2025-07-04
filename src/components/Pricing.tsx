import { Check, Star, Crown, Zap } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with basic courses',
      icon: Star,
      features: [
        'Access to 5 free courses',
        'Basic video quality',
        'Community forum access',
        'Mobile app access',
        'Course certificates'
      ],
      limitations: [
        'Limited course selection',
        'No offline downloads',
        'Basic support'
      ],
      buttonText: 'Get Started Free',
      buttonStyle: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'Best for serious learners and professionals',
      icon: Zap,
      features: [
        'Access to all 500+ courses',
        'HD video quality',
        'Offline downloads',
        'Priority support',
        'Course certificates',
        'Learning analytics',
        'Live Q&A sessions',
        'Project reviews'
      ],
      limitations: [],
      buttonText: 'Start Pro Trial',
      buttonStyle: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'per month',
      description: 'For teams and organizations',
      icon: Crown,
      features: [
        'Everything in Pro',
        'Team management dashboard',
        'Custom learning paths',
        'Dedicated account manager',
        'Advanced analytics',
        'Custom integrations',
        'Bulk user management',
        'White-label options'
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      buttonStyle: 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white',
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Learning Plan</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start with our free plan or unlock premium features with Pro and Enterprise options.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border ${
                  plan.popular 
                    ? 'border-blue-500 ring-4 ring-blue-500/20' 
                    : 'border-gray-200'
                } overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                      plan.name === 'Free' ? 'bg-gray-100' :
                      plan.name === 'Pro' ? 'bg-gradient-to-r from-blue-500 to-purple-600' :
                      'bg-gradient-to-r from-purple-500 to-pink-600'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        plan.name === 'Free' ? 'text-gray-600' : 'text-white'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-gray-600">{plan.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    </div>
                  </div>

                  <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 mb-8 ${plan.buttonStyle}`}>
                    {plan.buttonText}
                  </button>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.length > 0 && (
                      <>
                        <h4 className="font-semibold text-gray-900 mt-6 mb-3">Limitations:</h4>
                        {plan.limitations.map((limitation, limitIndex) => (
                          <div key={limitIndex} className="flex items-center">
                            <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                              <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                            </div>
                            <span className="text-gray-500">{limitation}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Not sure which plan is right for you?</h3>
            <p className="text-gray-600 mb-6">
              Try our Pro plan free for 7 days. No credit card required, cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200">
                Start Free Trial
              </button>
              <button className="text-blue-600 hover:text-blue-700 px-6 py-2 rounded-lg font-semibold transition-all duration-200">
                Compare Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
