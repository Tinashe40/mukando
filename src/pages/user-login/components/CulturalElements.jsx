import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CulturalElements = () => {
  const culturalSymbols = [
    {
      name: 'Unity',
      icon: 'Users',
      description: 'Stronger together',
      color: 'text-blue-600'
    },
    {
      name: 'Growth',
      icon: 'TrendingUp',
      description: 'Collective prosperity',
      color: 'text-green-600'
    },
    {
      name: 'Trust',
      icon: 'Handshake',
      description: 'Community bonds',
      color: 'text-indigo-600'
    }
  ];

  const testimonials = [
    {
      name: 'Chipo Mukamuri',
      location: 'Harare, Zimbabwe',
      message: `Mukando has transformed how our savings group operates. We can now track contributions transparently and access loans quickly when needed.`,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Tendai Moyo',
      location: 'Bulawayo, Zimbabwe',
      message: `The digital platform has made our traditional mukando more efficient. Everyone can see their savings grow in real-time.`,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const communityImages = [
    {
      src: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop',
      alt: 'African community gathering',
      caption: 'Traditional savings groups meeting'
    },
    {
      src: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?w=400&h=300&fit=crop',
      alt: 'People counting money together',
      caption: 'Collective financial planning'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Cultural Symbols */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50 rounded-xl p-4 sm:p-6 border border-slate-200">
        <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-3 sm:mb-4 text-center">Our Values</h3>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {culturalSymbols?.map((symbol, index) => (
            <div key={index} className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-1 sm:mb-2 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Icon name={symbol?.icon} size={16} className={symbol?.color} />
              </div>
              <p className="font-medium text-slate-900 text-xs sm:text-sm">{symbol?.name}</p>
              <p className="text-xs text-slate-500">{symbol?.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Community Images */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {communityImages?.map((image, index) => (
          <div key={index} className="relative overflow-hidden rounded-xl shadow-sm">
            <div className="h-40 sm:h-48 overflow-hidden">
              <Image
                src={image?.src}
                alt={image?.alt}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 sm:p-4">
              <p className="text-white text-xs sm:text-sm font-medium">{image?.caption}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Community Testimonials */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="font-semibold text-slate-900 text-sm sm:text-base text-center">Trusted by Communities</h3>
        {testimonials?.map((testimonial, index) => (
          <div key={index} className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-full flex-shrink-0">
                <Image
                  src={testimonial?.avatar}
                  alt={testimonial?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <p className="font-medium text-slate-900 text-xs sm:text-sm">{testimonial?.name}</p>
                  <div className="flex items-center gap-1">
                    <Icon name="MapPin" size={10} className="text-slate-500" />
                    <span className="text-xs text-slate-500">{testimonial?.location}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  "{testimonial?.message}"
                </p>
                <div className="flex items-center gap-1 mt-1 sm:mt-2">
                  {[...Array(5)]?.map((_, i) => (
                    <Icon key={i} name="Star" size={10} className="text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* African Pattern Decoration */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm">
        <div className="text-center space-y-2 sm:space-y-3">
          <div className="flex justify-center items-center gap-1 sm:gap-2">
            <div className="w-1 h-1 sm:w-2 sm:h-2 bg-blue-600 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-indigo-600 rounded-full"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-600 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-1 h-1 sm:w-2 sm:h-2 bg-red-600 rounded-full"></div>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-900">Ubuntu - "I am because we are"</p>
          <p className="text-xs text-slate-500">
            Embracing the African philosophy of interconnectedness and community support
          </p>
        </div>
      </div>
      {/* Language Support */}
      <div className="bg-slate-50 rounded-xl p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <Icon name="Globe" size={14} className="text-slate-500" />
            <span className="text-xs sm:text-sm text-slate-500">Available in:</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-medium text-slate-900">English</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs sm:text-sm text-slate-500">Shona (Coming Soon)</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs sm:text-sm text-slate-500">Ndebele (Coming Soon)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalElements;
