import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrustSignals = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'Bank-Level Security',
      description: 'Your data is protected with 256-bit SSL encryption'
    },
    {
      icon: 'Lock',
      title: 'Secure Transactions',
      description: 'All financial transactions are encrypted and monitored'
    },
    {
      icon: 'Users',
      title: 'Community Verified',
      description: 'Trusted by over 10,000+ African savings groups'
    },
    {
      icon: 'Award',
      title: 'Compliant Platform',
      description: 'Registered with local financial authorities'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Tinashe Mutero',
      location: 'Harare, Zimbabwe',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      quote: `Mukando has transformed how our savings group operates. We can now track everything digitally and make informed decisions about loans.`,
      rating: 5,
      groupSize: '25 members'
    },
    {
      id: 2,
      name: 'Grace Nyathi',
      location: 'Bulawayo, Zimbabwe',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      quote: `The transparency and ease of use is amazing. Our group has grown from 8 to 30 members since we started using Mukando.`,
      rating: 5,
      groupSize: '30 members'
    }
  ];

  const complianceBadges = [
    {
      name: 'RBZ Compliant',
      description: 'Reserve Bank of Zimbabwe',
      icon: 'BadgeCheck'
    },
    {
      name: 'POTRAZ Registered',
      description: 'Postal and Telecommunications Regulatory Authority',
      icon: 'Shield'
    },
    {
      name: 'ISO 27001',
      description: 'Information Security Management',
      icon: 'Award'
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={14}
        className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Security Features */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-warm">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Shield" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Why Choose Mukando?</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={feature.icon} size={16} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">{feature.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Community Testimonials */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-warm">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="MessageCircle" size={20} className="text-secondary" />
          <h3 className="text-lg font-semibold text-foreground">Trusted by Communities</h3>
        </div>
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="border-l-4 border-primary pl-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 overflow-hidden rounded-full flex-shrink-0 bg-muted">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    fallback={<Icon name="User" size={20} className="text-muted-foreground m-2" />}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground text-sm">{testimonial.name}</h4>
                    <div className="flex items-center gap-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {testimonial.location} • {testimonial.groupSize}
                  </p>
                  <p className="text-sm text-foreground italic">"{testimonial.quote}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Compliance Badges */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-warm">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Award" size={20} className="text-success" />
          <h3 className="text-lg font-semibold text-foreground">Regulatory Compliance</h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {complianceBadges.map((badge, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name={badge.icon} size={16} className="text-success" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">{badge.name}</h4>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Cultural Elements */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border border-border">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Coins" size={32} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Digitizing Traditional Savings
          </h3>
          <p className="text-sm text-muted-foreground">
            Bringing the trusted African tradition of community savings groups into the digital age with transparency, security, and modern convenience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;