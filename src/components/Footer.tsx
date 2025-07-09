
import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Truck className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-2xl font-bold">SkyNet Express</h3>
                <p className="text-sm text-gray-400">Delivery Solutions</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Your trusted partner for reliable, fast, and secure logistics solutions worldwide. 
              Connecting businesses and people through efficient shipping services.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter className="w-6 h-6 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="w-6 h-6 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Linkedin className="w-6 h-6 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/tracking" className="text-gray-400 hover:text-white transition-colors">
                  Track Shipment
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3">
              <li className="text-gray-400">Ground Transport</li>
              <li className="text-gray-400">Air Freight</li>
              <li className="text-gray-400">Ocean Freight</li>
              <li className="text-gray-400">Warehousing</li>
              <li className="text-gray-400">Logistics Solutions</li>
              <li className="text-gray-400">International Trade</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">123 Logistics Avenue</p>
                  <p className="text-gray-400">Business District, NY 10001</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-blue-400 mr-3" />
                <p className="text-gray-400">+1 (565) 310-4849</p>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-blue-400 mr-3" />
                <p className="text-gray-400">skyexness099@gmail.com</p>
              </div>
              
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-blue-400 mr-3 mt-1" />
                <div className="text-gray-400">
                  <p>Mon: Always Online</p>
                  <p>Sat: Always Online</p>
                  <p>Sun: Always Online</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2024 SkyNet Express Delivery Solutions. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
