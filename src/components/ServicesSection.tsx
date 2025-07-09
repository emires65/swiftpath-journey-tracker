
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Plane, Ship, Warehouse, Package, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: Truck,
    title: "Ground Transport",
    description: "Reliable ground transportation services for domestic and regional deliveries with real-time tracking.",
    features: ["Door-to-door delivery", "Real-time tracking", "Express options"],
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    icon: Plane,
    title: "Air Freight",
    description: "Fast and efficient air cargo services for time-sensitive shipments across the globe.",
    features: ["Express delivery", "Global coverage", "Temperature controlled"],
    image: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    icon: Ship,
    title: "Ocean Freight",
    description: "Cost-effective sea freight solutions for large volume shipments and container services.",
    features: ["Container shipping", "Bulk cargo", "Port-to-port"],
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    icon: Warehouse,
    title: "Warehousing",
    description: "Secure storage and distribution services with modern facilities and inventory management.",
    features: ["Climate controlled", "24/7 security", "Inventory management"],
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    icon: Package,
    title: "Logistics Solutions",
    description: "Comprehensive supply chain management and logistics consulting for your business needs.",
    features: ["Supply chain optimization", "Consulting", "Custom solutions"],
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    icon: Globe,
    title: "International Trade",
    description: "Global trade services including customs clearance, documentation, and compliance support.",
    features: ["Customs clearance", "Documentation", "Compliance support"],
    image: "https://images.unsplash.com/photo-1526777890143-4778a121a0ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive logistics solutions tailored to meet your shipping and transportation needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${service.image})` }}
                >
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300" />
                  <div className="absolute top-4 left-4 bg-white rounded-full p-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white transition-all" asChild>
                    <Link to="/services">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
