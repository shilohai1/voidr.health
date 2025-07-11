
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

export const TubelightNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <picture>
              <source srcSet="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.webp" type="image/webp" />
              <img 
                src="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.png" 
                alt="VOIDR" 
                className="h-8 w-auto"
              />
            </picture>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Home
            </Link>
            
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-gray-900 transition-colors font-medium">
                Services
                <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => scrollToSection('clinicbot-section')}>
                  ClinicBot
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/symptom-checker">AskVoidr</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/case-wise">Case Wise</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Pricing
            </button>
            
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              About
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              
              <div className="px-2">
                <div className="text-gray-700 font-medium mb-2">Services</div>
                <div className="pl-4 space-y-2">
                  <button
                    onClick={() => {
                      scrollToSection('clinicbot-section');
                      setIsOpen(false);
                    }}
                    className="block text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    ClinicBot
                  </button>
                  <Link
                    to="/symptom-checker"
                    className="block text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    AskVoidr
                  </Link>
                  <Link
                    to="/case-wise"
                    className="block text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Case Wise
                  </Link>
                </div>
              </div>
              
              <button
                onClick={() => {
                  scrollToSection('pricing');
                  setIsOpen(false);
                }}
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium px-2 py-1 text-left"
              >
                Pricing
              </button>
              
              <button
                onClick={() => {
                  scrollToSection('about');
                  setIsOpen(false);
                }}
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium px-2 py-1 text-left"
              >
                About
              </button>
              
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
