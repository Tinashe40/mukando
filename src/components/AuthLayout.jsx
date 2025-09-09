import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { Coins } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 text-center"
        >
          <div className="mb-6">
            <Coins className="mx-auto" size={64} />
          </div>
          <h1 className="text-5xl font-bold mb-4">Welcome to Mukando</h1>
          <p className="text-xl text-blue-200 max-w-md">
            Your trusted platform for community savings, group loans, and financial empowerment.
          </p>
        </motion.div>
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="w-full flex items-center justify-center p-8 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <div className="text-center mb-8 lg:hidden">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
                    <Coins className="text-white" size={32} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Mukando</h1>
                <p className="text-slate-600">Community Savings & Loans Platform</p>
            </div>
            <Outlet />
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Mukando. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
