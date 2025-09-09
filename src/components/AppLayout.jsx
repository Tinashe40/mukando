import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import { cn } from '../utils/cn';

const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main
        className={cn(
          'transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64',
          'pt-20 lg:pt-6 pb-20 lg:pb-6'
        )}
      >
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
