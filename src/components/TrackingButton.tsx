
import React from 'react';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrackingButton = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Track Your Package?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get real-time updates on your shipment with our advanced tracking system
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-blue-50 text-xl px-12 py-6 h-auto shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            <Link to="/tracking" className="flex items-center space-x-3">
              <Package className="w-8 h-8" />
              <span className="font-bold">Track Your Shipment</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrackingButton;
