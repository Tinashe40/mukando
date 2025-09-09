import React from 'react';
import { FileText, Shield, Lock, Users } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 py-12">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText size={32} className="text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="bg-card rounded-2xl p-8 shadow-warm border border-border">
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield size={24} className="text-primary" />
              Introduction
            </h2>
            <p className="text-muted-foreground mb-4">
              Welcome to Mukando, the community savings platform that helps groups manage their finances transparently and efficiently.
            </p>
            <p className="text-muted-foreground">
              By accessing or using our services, you agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lock size={24} className="text-primary" />
              User Responsibilities
            </h2>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use the service only for lawful purposes</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users size={24} className="text-primary" />
              Community Guidelines
            </h2>
            <p className="text-muted-foreground mb-4">
              Mukando is built on trust and transparency. We expect all users to:
            </p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>Treat other community members with respect</li>
              <li>Fulfill their financial commitments to their groups</li>
              <li>Report any suspicious activity to our support team</li>
              <li>Use the platform in accordance with group rules and local regulations</li>
            </ul>
          </section>

          <div className="bg-muted/30 p-6 rounded-xl mt-10">
            <p className="text-sm text-muted-foreground">
              For questions about these terms, please contact us at{' '}
              <a href="mailto:legal@mukando.com" className="text-primary hover:underline">
                legal@mukando.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;