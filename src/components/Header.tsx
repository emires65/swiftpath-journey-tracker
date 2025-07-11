
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, Phone, Mail } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">EasyShipment</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`hover:text-blue-600 transition-colors ${isActive('/') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
            >
              Home
            </Link>
            <Link 
              to="/tracking" 
              className={`hover:text-blue-600 transition-colors ${isActive('/tracking') || isActive('/track') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
            >
              Track Package
            </Link>
            <Link 
              to="/services" 
              className={`hover:text-blue-600 transition-colors ${isActive('/services') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
            >
              Services
            </Link>
            <Link 
              to="/contact" 
              className={`hover:text-blue-600 transition-colors ${isActive('/contact') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4 text-blue-600" />
                <span className="text-gray-600">+1 (565) 310-4849</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-gray-600">info@easyshipment.com</span>
              </div>
            </div>
            <Button asChild>
              <Link to="/contact">Get Quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
