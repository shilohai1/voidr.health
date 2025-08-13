import React from "react";
import { Instagram, Twitter, Heart, Youtube } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  const scrollToPricing = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // If not on home page, navigate first
    if (location.pathname !== "/") {
      window.location.href = "/#pricing";
      return;
    }

    // Find the pricing section
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <picture>
              <source
                srcSet="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.webp"
                type="image/webp"
              />
              <img
                src="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.png"
                alt="VOIDR"
                className="h-8 sm:h-10 w-auto mb-4"
                loading="lazy"
                width="120"
                height="40"
              />
            </picture>
            <p className="text-gray-400 mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
              AI-powered tools designed specifically for busy Medical students,
              Residents, and Doctors. Simplifying medical education one step at
              a time.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://instagram.com/voidrhealth"
                className="text-gray-400 hover:text-white transition-colors p-2 -m-2"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/voidrhealth"
                className="text-gray-400 hover:text-white transition-colors p-2 -m-2"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/channel/UCWwnTHkCfCBmHD8_ZIA9avA"
                className="text-gray-400 hover:text-white transition-colors p-2 -m-2"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="order-3 lg:order-2">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/#pricing"
                  onClick={scrollToPricing}
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="/affiliates"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Affiliates
                </a>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  About Us
                </Link>
              </li>
              {/* Added Blogs link */}
              <li>
                <Link
                  to="/Blog"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="order-4 lg:order-3">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-conditions"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Created by Section */}
          <div className="order-2 lg:order-4 sm:text-right lg:text-right">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 sm:p-4 inline-block w-full sm:w-auto">
              <p className="text-xs sm:text-sm text-gray-300 flex items-center gap-1 justify-center sm:justify-end">
                Created by a med student with{" "}
                <Heart className="w-4 h-4 text-red-500 fill-current flex-shrink-0" />{" "}
                for med students
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            © 2025 Voidr Health - All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
