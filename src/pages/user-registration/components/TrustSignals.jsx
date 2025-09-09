import { ShieldCheck, Star, Users } from 'lucide-react';
import AppIcon from '../../../components/AppIcon';

const TrustSignals = () => {
  const testimonials = [
    {
      name: 'Tinashe M.',
      role: 'Group Admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      quote: 'Mukando has transformed how our savings group operates. We can now track everything digitally and make informed decisions about loans.',
    },
    {
      name: 'Grace N.',
      role: 'Member',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      quote: 'The transparency and ease of use is amazing. Our group has grown from 8 to 30 members since we started using Mukando.',
    },
  ];

  const features = [
    { icon: 'ShieldCheck', title: 'Bank-Level Security', description: 'Your data is protected with 256-bit SSL encryption.' },
    { icon: 'Users', title: 'Community-Centric', description: 'Built for the unique needs of savings groups.' },
    { icon: 'FileText', title: 'Transparent Reporting', description: 'Clear records of all contributions and loans.' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-6">Why communities trust Mukando</h3>
        <div className="space-y-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-background rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <AppIcon name={feature.icon} size={24} className="text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{feature.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-foreground mb-6">From our members</h3>
        <div className="space-y-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-background p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <span className="text-sm text-muted-foreground">- {testimonial.role}</span>
                  </div>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-foreground/90 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;
