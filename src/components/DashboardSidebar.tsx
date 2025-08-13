import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Settings, LogOut, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LiquidCard } from './ui/liquid-glass-card';

interface SidebarProps {
  className?: string;
}

const DashboardSidebar = ({ className }: SidebarProps) => {
  const [open, setOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handlePricingClick = () => {
    setOpen(false);
    navigate('/');
    setTimeout(() => {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const options = [
    {
      label: "Dashboard",
      onClick: () => navigate('/dashboard'),
      Icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      label: "Pricing",
      onClick: handlePricingClick,
      Icon: <CreditCard className="h-4 w-4" />,
    },
    {
      label: "Settings",
      onClick: () => navigate('/settings'),
      Icon: <Settings className="h-4 w-4" />,
    },
    {
      label: "Logout",
      onClick: handleLogout,
      Icon: <LogOut className="h-4 w-4" />,
    },
  ];

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 shadow-[0_0_20px_rgba(0,0,0,0.2)] border-none rounded-xl backdrop-blur-sm flex items-center"
      >
        <picture>
          <source srcSet="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.webp" type="image/webp" />
          <img 
            src="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.png" 
            alt="VOIDR" 
            className="h-8 w-auto"
          />
        </picture>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: -5, scale: 0.95, filter: "blur(10px)" }}
            animate={{ y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ y: -5, scale: 0.95, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "circInOut", type: "spring" }}
            className="absolute right-0 z-10 w-48 mt-2 p-1 bg-[#11111198] rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm flex flex-col gap-2"
          >
            {options.map((option, index) => (
              <motion.button
                initial={{
                  opacity: 0,
                  x: 10,
                  scale: 0.95,
                  filter: "blur(10px)",
                }}
                animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                exit={{
                  opacity: 0,
                  x: 10,
                  scale: 0.95,
                  filter: "blur(10px)",
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: "easeInOut",
                  type: "spring",
                }}
                whileHover={{
                  backgroundColor: "#11111140",
                  transition: {
                    duration: 0.4,
                    ease: "easeInOut",
                  },
                }}
                whileTap={{
                  scale: 0.95,
                  transition: {
                    duration: 0.2,
                    ease: "easeInOut",
                  },
                }}
                key={option.label}
                onClick={() => {
                  setOpen(false);
                  option.onClick();
                }}
                className="px-2 py-3 cursor-pointer text-white text-sm rounded-lg w-full text-left flex items-center gap-x-2"
              >
                {option.Icon}
                {option.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardSidebar; 
