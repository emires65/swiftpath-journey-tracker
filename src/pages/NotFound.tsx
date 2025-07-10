
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, ArrowLeft, Phone } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Package className="h-24 w-24 text-primary mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-foreground mb-4">404 - Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back Home
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
