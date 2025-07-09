
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Truck, Phone, Mail, Clock } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-blue-900 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>contact@swiftpathdelivery.org</span>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>Mon-Fri: 8AM-6PM | Sat: 9AM-4PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Truck className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">SwiftPath</h1>
              <p className="text-sm text-gray-600">Delivery Solutions</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors hover:text-blue-600 ${
                isActive('/') ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className={`font-medium transition-colors hover:text-blue-600 ${
                isActive('/services') ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Services
            </Link>
            <Link 
              to="/tracking" 
              className={`font-medium transition-colors hover:text-blue-600 ${
                isActive('/tracking') ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Track Shipment
            </Link>
            <Link 
              to="/contact" 
              className={`font-medium transition-colors hover:text-blue-600 ${
                isActive('/contact') ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Contact
            </Link>
            <Button asChild>
              <Link to="/create-shipment">Ship Now</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 border-t">
            <div className="flex flex-col space-y-4 pt-4">
              <Link 
                to="/" 
                className={`font-medium transition-colors hover:text-blue-600 ${
                  isActive('/') ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/services" 
                className={`font-medium transition-colors hover:text-blue-600 ${
                  isActive('/services') ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/tracking" 
                className={`font-medium transition-colors hover:text-blue-600 ${
                  isActive('/tracking') ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Track Shipment
              </Link>
              <Link 
                to="/contact" 
                className={`font-medium transition-colors hover:text-blue-600 ${
                  isActive('/contact') ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Button asChild className="w-fit">
                <Link to="/create-shipment" onClick={() => setIsOpen(false)}>Ship Now</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
