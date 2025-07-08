
import React from 'react';
import { Instagram, Twitter, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <img 
              src="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.png" 
              alt="VOIDR" 
              className="h-10 w-auto mb-4"
            />
            <p className="text-gray-400 mb-6 max-w-md">
              AI-powered tools designed specifically for busy Medical students, Residents, and Doctors. 
              Simplifying medical education one video at a time.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/voidr.health" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/voidrhealth" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#products" className="text-gray-400 hover:text-white transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/affiliates" className="text-gray-400 hover:text-white transition-colors">
                  Affiliates
                </a>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Created by Section */}
          <div className="text-right">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 inline-block">
              <p className="text-sm text-gray-300 flex items-center gap-1 justify-center">
                Created by a med student with <Heart className="w-4 h-4 text-red-500 fill-current" /> for med students
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Voidr Health - All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
