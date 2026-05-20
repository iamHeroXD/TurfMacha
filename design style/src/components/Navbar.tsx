import React, { useEffect, useState } from 'react';
import { MapPin, Menu, X, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
const NAV_LINKS = [
{
  to: '/turfs',
  label: 'Browse Turfs'
},
{
  to: '/how-it-works',
  label: 'How it works'
},
{
  to: '/for-owners',
  label: 'For Owners'
},
{
  to: '/about',
  label: 'About'
}];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled || mobileMenuOpen ? 'bg-turf-cream/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-turf-emerald rounded-xl flex items-center justify-center transform -rotate-6">
              <MapPin className="w-6 h-6 text-turf-lime" />
            </div>
            <span className="font-display font-bold text-2xl text-turf-emerald tracking-tight">
              TurfMacha
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const isActive =
              location.pathname === link.to ||
              link.to === '/turfs' && location.pathname.startsWith('/turfs');
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative font-medium transition-colors ${isActive ? 'text-turf-emerald' : 'text-turf-charcoal hover:text-turf-emerald'}`}>
                  
                  {link.label}
                  {isActive &&
                  <span className="absolute -bottom-1.5 left-0 right-0 mx-auto w-1.5 h-1.5 rounded-full bg-turf-lime"></span>
                  }
                </Link>);

            })}

            <div className="flex items-center gap-3 pl-3 border-l border-turf-emerald/10">
              <Link
                to="/login"
                className="flex items-center gap-1.5 font-medium text-turf-charcoal hover:text-turf-emerald transition-colors">
                
                <LogIn className="w-4 h-4" />
                Sign in
              </Link>
              <Link
                to="/download"
                className="bg-turf-emerald text-white px-5 py-2.5 rounded-full font-medium hover:bg-turf-emerald/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-turf-emerald/20">
                
                Download App
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-turf-emerald"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu">
            
            {mobileMenuOpen ?
            <X className="w-6 h-6" /> :

            <Menu className="w-6 h-6" />
            }
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen &&
      <div className="md:hidden absolute top-full left-0 w-full bg-turf-cream border-t border-turf-emerald/10 shadow-lg py-4 px-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
          const isActive =
          location.pathname === link.to ||
          link.to === '/turfs' && location.pathname.startsWith('/turfs');
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`p-3 rounded-xl font-medium ${isActive ? 'bg-turf-emerald/10 text-turf-emerald' : 'text-turf-charcoal'}`}>
              
                {link.label}
              </Link>);

        })}
          <Link
          to="/login"
          className="p-3 rounded-xl font-medium text-turf-charcoal flex items-center gap-2">
          
            <LogIn className="w-4 h-4" /> Sign in
          </Link>
          <Link
          to="/download"
          className="bg-turf-emerald text-white px-6 py-3 rounded-xl font-medium w-full mt-2 text-center">
          
            Download App
          </Link>
        </div>
      }
    </nav>);

}