import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Building2, Users, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

export const TubelightNavbar = () => {
  const location = useLocation();

  // Only show navbar on landing page
  if (location.pathname !== '/') {
    return null;
  }

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 100; // Account for fixed navbar + some padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setIsMobileMenuOpen(false);
      setOpenDropdown(null);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-4 pb-2"> {/* Adjusted padding */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <picture>
              <source srcSet="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.webp" type="image/webp" />
              <img 
                src="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.png" 
                alt="VOIDR" 
                className="h-24 w-auto" // Changed from h-12 to h-24 (96px)
              />
            </picture>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/20 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
            {/* Services Section */}
            <DropdownMenu onOpenChange={(open) => {
              if (open) {
                setActiveTab('services');
                setOpenDropdown('services');
              } else {
                setOpenDropdown(null);
              }
            }}>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                    "text-gray-700 hover:text-primary",
                    activeTab === 'services' && "text-primary",
                  )}
                >
                  <span className="flex items-center gap-1">
                    <Building2 size={18} strokeWidth={2.5} className="md:hidden" />
                    <span className="hidden md:inline">Services</span>
                    <ChevronDown size={14} />
                  </span>
                  {activeTab === 'services' && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                        <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                      </div>
                    </motion.div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-48 mt-2 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-lg border border-white/20"
              >
                <button onClick={() => scrollToSection('clinicbot-section')} className="w-full">
                  <DropdownMenuItem className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-primary/10 cursor-pointer group">
                    <span>ClinicBot</span>
                    <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </DropdownMenuItem>
                </button>
                <button onClick={() => scrollToSection('AskVoidrPromoSection')} className="w-full">
                  <DropdownMenuItem className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-primary/10 cursor-pointer group">
                    <span>AskVoidr</span>
                    <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </DropdownMenuItem>
                </button>
                <button onClick={() => scrollToSection('CaseWisePromoSection')} className="w-full">
                  <DropdownMenuItem className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-primary/10 cursor-pointer group">
                    <span>Case Wise</span>
                    <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </DropdownMenuItem>
                </button>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Pricing Section */}
            <button
              onClick={() => scrollToSection('pricing')}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                "text-gray-700 hover:text-primary"
              )}
            >
              <span className="flex items-center gap-1">
                <span className="hidden md:inline">Pricing</span>
              </span>
            </button>

            {/* Resources Section (formerly Blog Section) */}
            <DropdownMenu onOpenChange={(open) => {
              if (open) {
                setActiveTab('resources');
                setOpenDropdown('resources');
              } else {
                setOpenDropdown(null);
              }
            }}>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                    "text-gray-700 hover:text-primary",
                    activeTab === 'resources' && "text-primary",
                  )}
                >
                  <span className="flex items-center gap-1">
                    <span className="hidden md:inline">Resources</span>
                    <ChevronDown size={14} />
                  </span>
                  {activeTab === 'resources' && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                        <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                      </div>
                    </motion.div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-48 mt-2 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-lg border border-white/20"
              >
                <Link to="/blog" className="block">
                  <DropdownMenuItem className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-primary/10 cursor-pointer group">
                    <span>Blogs</span>
                    <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </DropdownMenuItem>
                </Link>
                <Link to="/about" className="block">
                  <DropdownMenuItem className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-primary/10 cursor-pointer group">
                    <span>About Us</span>
                    <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </DropdownMenuItem>
                </Link>
                <button onClick={() => scrollToSection('faq')} className="w-full">
                  <DropdownMenuItem className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-primary/10 cursor-pointer group">
                    <span>FAQ's</span>
                    <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </DropdownMenuItem>
                </button>
                <Link to="/privacy-policy" className="block">
                  <DropdownMenuItem className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-primary/10 cursor-pointer group">
                    <span>Privacy Policy</span>
                    <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </DropdownMenuItem>
                </Link>
                <Link to="/terms-conditions" className="block">
                  <DropdownMenuItem className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-primary/10 cursor-pointer group">
                    <span>T&C</span>
                    <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Find Us Section (formerly Who we are Section) */}
            <DropdownMenu onOpenChange={(open) => {
              if (open) {
                setActiveTab('find-us');
                setOpenDropdown('find-us');
              } else {
                setOpenDropdown(null);
              }
            }}>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                    "text-gray-700 hover:text-primary",
                    activeTab === 'find-us' && "text-primary",
                  )}
                >
                  <span className="flex items-center gap-1">
                    <Users size={18} strokeWidth={2.5} className="md:hidden" />
                    <span className="hidden md:inline">Find Us</span>
                    <ChevronDown size={14} />
                  </span>
                  {activeTab === 'find-us' && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                        <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                      </div>
                    </motion.div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-48 mt-2 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-lg border border-white/20"
              >
                <a href="https://www.instagram.com/voidrhealth/" target="_blank" rel="noopener noreferrer" className="block">
                  <DropdownMenuItem className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-primary/10 cursor-pointer group">
                    <span>Instagram</span>
                    <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </DropdownMenuItem>
                </a>
                <a href="https://x.com/voidrhealth" target="_blank" rel="noopener noreferrer" className="block">
                  <DropdownMenuItem className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-primary/10 cursor-pointer group">
                    <span>Twitter/X</span>
                    <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </DropdownMenuItem>
                </a>
                <a href="https://www.producthunt.com/products/voidr-health-2?utm_source=other&utm_medium=social" target="_blank" rel="noopener noreferrer" className="block">
                  <DropdownMenuItem className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-primary/10 cursor-pointer group">
                    <span>Product Hunt</span>
                    <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </DropdownMenuItem>
                </a>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Get Started Button */}
          <div className="hidden md:block">
            <Link to="/auth">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#036873] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 bg-white/90 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {/* Services Section */}
                <div className="space-y-2">
                  <div className="font-semibold text-gray-900">Services</div>
                  <button 
                    onClick={() => scrollToSection('clinicbot-section')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 rounded-lg"
                  >
                    ClinicBot
                  </button>
                  <button 
                    onClick={() => scrollToSection('AskVoidrPromoSection')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 rounded-lg"
                  >
                    AskVoidr
                  </button>
                  <button 
                    onClick={() => scrollToSection('CaseWisePromoSection')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 rounded-lg"
                  >
                    Case Wise
                  </button>
                </div>

                {/* Pricing Section */}
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="block w-full text-left px-4 py-2 font-semibold text-gray-900 hover:bg-primary/10 rounded-lg"
                >
                  Pricing
                </button>

                {/* Resources Section */}          
                <div className="space-y-2">
                  <div className="font-semibold text-gray-900">Resources</div>
                  <Link to="/blog" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 rounded-lg">
                    Blogs
                  </Link>
                  <Link to="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 rounded-lg">
                    About Us
                  </Link>
                  <button onClick={() => scrollToSection('faq')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 rounded-lg">
                    FAQ's
                  </button>
                  <Link to="/privacy-policy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 rounded-lg">
                    Privacy Policy
                  </Link>
                  <Link to="/terms-conditions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 rounded-lg">
                    T&C
                  </Link>
                </div>

                {/* Find Us Section */}
                <div className="space-y-2">
                  <div className="font-semibold text-gray-900">Find Us</div>
                  <a 
                    href="https://www.instagram.com/voidrhealth/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 rounded-lg"
                  >
                    Instagram
                  </a>
                  <a 
                    href="https://x.com/voidrhealth" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 rounded-lg"
                  >
                    Twitter/X
                  </a>
                  <a 
                    href="https://www.producthunt.com/products/voidr-health-2?utm_source=other&utm_medium=social" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 rounded-lg"
                  >
                    Product Hunt
                  </a>
                </div>

                <Link to="/auth" className="block">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-primary text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

// Also export as NavBar for backwards compatibility
export const NavBar = TubelightNavbar;
