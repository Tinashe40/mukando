import { Database, Eye, Lock, Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 py-12">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield size={32} className="text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your privacy is important to us. This policy explains what personal data we collect and how we use it.
        </p>
      </div>

      <div className="bg-card rounded-2xl p-8 shadow-warm border border-border">
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Database size={24} className="text-primary" />
              Information We Collect
            </h2>
            <p className="text-muted-foreground mb-4">
              To provide our services, we collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>Account information (name, email, phone number)</li>
              <li>Financial information related to your savings group activities</li>
              <li>Communication preferences</li>
              <li>Device and usage information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Eye size={24} className="text-primary" />
              How We Use Your Information
            </h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and security alerts</li>
              <li>Respond to your comments, questions, and requests</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lock size={24} className="text-primary" />
              Data Security
            </h2>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
            </p>
          </section>

          <div className="bg-muted/30 p-6 rounded-xl mt-10">
            <p className="text-sm text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@mukando.com" className="text-primary hover:underline">
                privacy@mukando.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
