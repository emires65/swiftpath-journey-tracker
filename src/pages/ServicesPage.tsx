
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, Plane, Ship, Warehouse, Package, Globe, Clock, Shield, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  const services = [
    {
      icon: Truck,
      title: "Ground Transport",
      description: "Reliable ground transportation services for domestic and regional deliveries with real-time tracking and flexible scheduling options.",
      features: [
        "Door-to-door delivery",
        "Real-time GPS tracking",
        "Express and standard options",
        "Temperature-controlled vehicles",
        "Insurance coverage included",
        "24/7 customer support"
      ],
      pricing: "Starting at $25",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: Plane,
      title: "Air Freight",
      description: "Fast and efficient air cargo services for time-sensitive shipments across the globe with priority handling and customs clearance.",
      features: [
        "Express air delivery",
        "Global airport network",
        "Priority customs clearance",
        "Temperature controlled cargo",
        "Dangerous goods certified",
        "Real-time flight tracking"
      ],
      pricing: "Starting at $75",
      image: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: Ship,
      title: "Ocean Freight",
      description: "Cost-effective sea freight solutions for large volume shipments and container services with comprehensive port-to-port coverage.",
      features: [
        "Full container loads (FCL)",
        "Less container loads (LCL)",
        "Port-to-port delivery",
        "Customs documentation",
        "Cargo insurance",
        "Global port network"
      ],
      pricing: "Starting at $45",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: Warehouse,
      title: "Warehousing & Storage",
      description: "Secure storage and distribution services with modern facilities, inventory management, and flexible storage solutions.",
      features: [
        "Climate-controlled facilities",
        "24/7 security monitoring",
        "Inventory management system",
        "Pick and pack services",
        "Cross-docking capabilities",
        "Flexible storage terms"
      ],
      pricing: "Custom pricing",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: Package,
      title: "Logistics Solutions",
      description: "Comprehensive supply chain management and logistics consulting for optimizing your business operations and reducing costs.",
      features: [
        "Supply chain optimization",
        "Logistics consulting",
        "Custom solution design",
        "Performance analytics",
        "Cost reduction strategies",
        "Technology integration"
      ],
      pricing: "Custom pricing",
      image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: Globe,
      title: "International Trade",
      description: "Global trade services including customs clearance, documentation, compliance support, and international regulations guidance.",
      features: [
        "Customs clearance",
        "Trade documentation",
        "Compliance consulting",
        "Duty optimization",
        "International regulations",
        "Trade finance support"
      ],
      pricing: "Starting at $150",
      image: "https://images.unsplash.com/photo-1526777890143-4778a121a0ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const whyChooseUs = [
    {
      icon: Clock,
      title: "On-Time Delivery",
      description: "98% on-time delivery rate with real-time tracking and proactive communication."
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Advanced security measures and comprehensive insurance coverage for your peace of mind."
    },
    {
      icon: Award,
      title: "Industry Leaders",
      description: "15+ years of experience with industry certifications and quality standards."
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Round-the-clock customer support with dedicated account managers."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Our Services
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Comprehensive logistics solutions tailored to meet your shipping and transportation needs across the globe
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div 
                    className="h-64 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${service.image})` }}
                  >
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute top-6 left-6 bg-white rounded-full p-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="absolute bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full font-semibold">
                      {service.pricing}
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-800">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 mb-6">
                      {service.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-700">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full" asChild>
                      <Link to="/create-shipment">Get Quote</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Why Choose SwiftPath?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing exceptional logistics services that exceed your expectations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                  <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Ship?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get started with SwiftPath today and experience the difference of professional logistics services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100" asChild>
              <Link to="/create-shipment">Create Shipment</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
