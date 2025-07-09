
import React from 'react';
import { Package, Globe, Clock, Award } from 'lucide-react';

const stats = [
  {
    icon: Package,
    number: "50,000+",
    label: "Packages Delivered",
    description: "Successfully delivered worldwide"
  },
  {
    icon: Globe,
    number: "200+",
    label: "Countries Served",
    description: "Global shipping network"
  },
  {
    icon: Clock,
    number: "24/7",
    label: "Customer Support",
    description: "Always here to help"
  },
  {
    icon: Award,
    number: "15+",
    label: "Years Experience",
    description: "Industry expertise"
  }
];

const StatsSection = () => {
  return (
    <section className="bg-blue-900 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center text-white">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-bold mb-2">{stat.number}</h3>
                <h4 className="text-xl font-semibold mb-1">{stat.label}</h4>
                <p className="text-blue-200">{stat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
