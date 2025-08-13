import React, { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { LucideIcon, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

interface NavItem {
  name: string
  url: string
  icon?: LucideIcon
  hasDropdown?: boolean
  dropdownItems?: { name: string; url: string }[]
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0]?.name || "")
  const [isMobile, setIsMobile] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleItemClick = (item: NavItem) => {
    if (item.hasDropdown) {
      setOpenDropdown(openDropdown === item.name ? null : item.name)
    } else {
      setActiveTab(item.name)
      setOpenDropdown(null)
      
      // Handle scroll to section
      if (item.url.startsWith('#')) {
        const element = document.querySelector(item.url)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  return (
    <div className={cn("fixed top-0 left-1/2 -translate-x-1/2 z-50 pt-6 w-full max-w-7xl px-16", className)}>
      <div 
        ref={navRef}
        className="flex items-center justify-between bg-white/10 border border-white/20 backdrop-blur-lg py-3 px-6 rounded-full shadow-lg"
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <picture>
              <source srcSet="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.webp" type="image/webp" />
              <img 
                src="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.png" 
                alt="VOIDR" 
                className="h-8 w-auto cursor-pointer"
              />
            </picture>
          </Link>
        </div>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {items.slice(0, -1).map((item) => {
            const isActive = activeTab === item.name

            return (
              <div key={item.name} className="relative">
                <button
                  onClick={() => handleItemClick(item)}
                  onMouseEnter={() => item.hasDropdown && setOpenDropdown(item.name)}
                  className={cn(
                    "relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300",
                    "hover:opacity-80 text-black",
                    isActive && "opacity-100"
                  )}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-primary/10 rounded-full -z-10"
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

                {/* Smooth Liquid Glass Dropdown */}
                {item.hasDropdown && openDropdown === item.name && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full mt-2 left-0 min-w-[180px] z-50 rounded-t-[1.5rem] rounded-b-[1.5rem] overflow-hidden"
                    onMouseLeave={() => setOpenDropdown(null)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <div className="rounded-t-[1.5rem] rounded-b-[1.5rem] shadow-lg py-2 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-t-[1.5rem] rounded-b-[1.5rem]" />
                      <div className="relative">
                        {item.dropdownItems?.map((dropdownItem, index) => (
                          <motion.div
                            key={dropdownItem.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            {dropdownItem.url.startsWith('http') ? (
                              <a
                                href={dropdownItem.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setOpenDropdown(null)}
                                className="block w-full text-left px-4 py-3 text-sm hover:bg-primary/10 transition-all duration-200 relative group text-black"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                <span className="relative">{dropdownItem.name}</span>
                              </a>
                            ) : dropdownItem.url.startsWith('#') ? (
                              <button
                                onClick={() => {
                                  setOpenDropdown(null);
                                  const element = document.querySelector(dropdownItem.url);
                                  if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                  }
                                }}
                                className="block w-full text-left px-4 py-3 text-sm hover:bg-primary/10 transition-all duration-200 relative group text-black"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                <span className="relative">{dropdownItem.name}</span>
                              </button>
                            ) : (
                            <Link
                              to={dropdownItem.url}
                                onClick={() => setOpenDropdown(null)}
                                className="block w-full text-left px-4 py-3 text-sm hover:bg-primary/10 transition-all duration-200 relative group text-black"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                              <span className="relative">{dropdownItem.name}</span>
                            </Link>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>

        {/* Login Button - Direct Link */}
        <div className="flex items-center">
          <Link 
            to="/auth"
            className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-black"
          >
            <User size={20} />
          </Link>
        </div>
      </div>
    </div>
  )
} 
