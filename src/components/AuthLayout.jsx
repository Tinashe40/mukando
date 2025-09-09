import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Icon from './AppIcon';
import { cn } from '../utils/cn';
import { Coins } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="p-1 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          <div className="px-8 py-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
                <Coins className="text-white" size={32} />
                {/* <Icon name="Coins" size={32} className="text-white" /> */}
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Mukando</h1>
              <p className="text-slate-600">Community Savings & Loans Platform</p>
            </div>
            <Outlet />
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Mukando. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;