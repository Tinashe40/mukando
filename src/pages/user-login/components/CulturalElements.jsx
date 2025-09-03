import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CulturalElements = () => {
  const culturalSymbols = [
    {
      name: 'Unity',
      icon: 'Users',
      description: 'Stronger together',
      color: 'text-primary'
    },
    {
      name: 'Growth',
      icon: 'TrendingUp',
      description: 'Collective prosperity',
      color: 'text-secondary'
    },
    {
      name: 'Trust',
      icon: 'Handshake',
      description: 'Community bonds',
      color: 'text-success'
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
    <div className="space-y-8">
      {/* Cultural Symbols */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-success/5 rounded-lg p-6 border border-border">
        <h3 className="font-semibold text-foreground mb-4 text-center">Our Values</h3>
        <div className="grid grid-cols-3 gap-4">
          {culturalSymbols?.map((symbol, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-card rounded-full flex items-center justify-center shadow-warm">
                <Icon name={symbol?.icon} size={20} className={symbol?.color} />
              </div>
              <p className="font-medium text-foreground text-sm">{symbol?.name}</p>
              <p className="text-xs text-muted-foreground">{symbol?.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Community Images */}
      <div className="grid grid-cols-1 gap-4">
        {communityImages?.map((image, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg shadow-warm">
            <div className="h-48 overflow-hidden">
              <Image
                src={image?.src}
                alt={image?.alt}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="text-white text-sm font-medium">{image?.caption}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Community Testimonials */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground text-center">Trusted by Communities</h3>
        {testimonials?.map((testimonial, index) => (
          <div key={index} className="bg-card rounded-lg p-4 border border-border shadow-warm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 overflow-hidden rounded-full flex-shrink-0">
                <Image
                  src={testimonial?.avatar}
                  alt={testimonial?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-medium text-foreground text-sm">{testimonial?.name}</p>
                  <div className="flex items-center gap-1">
                    <Icon name="MapPin" size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{testimonial?.location}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "{testimonial?.message}"
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)]?.map((_, i) => (
                    <Icon key={i} name="Star" size={12} className="text-warning fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* African Pattern Decoration */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-warm">
        <div className="text-center space-y-3">
          <div className="flex justify-center items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <div className="w-4 h-4 bg-success rounded-full"></div>
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <div className="w-2 h-2 bg-accent rounded-full"></div>
          </div>
          <p className="text-sm font-medium text-foreground">Ubuntu - "I am because we are"</p>
          <p className="text-xs text-muted-foreground">
            Embracing the African philosophy of interconnectedness and community support
          </p>
        </div>
      </div>
      {/* Language Support */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Icon name="Globe" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Available in:</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">English</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">Shona (Coming Soon)</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">Ndebele (Coming Soon)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalElements;