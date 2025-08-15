import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, MapPin, Compass } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-travel-blue-50 via-white to-travel-green-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Floating elements */}
        <div className="relative mb-8">
          <div className="absolute -top-8 -left-8 text-travel-blue-200 animate-float">
            <MapPin className="w-8 h-8" />
          </div>
          <div
            className="absolute -top-4 -right-6 text-travel-green-200 animate-float"
            style={{ animationDelay: "1s" }}
          >
            <Compass className="w-6 h-6" />
          </div>

          {/* 404 illustration */}
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <span className="text-4xl font-bold text-primary">404</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Oops! Adventure Not Found
        </h1>
        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          It looks like this path doesn't lead anywhere. Let's get you back on
          track to discover amazing travel experiences.
        </p>

        <div className="space-y-4">
          <Button asChild size="lg" className="w-full">
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="w-full">
            <Link to="/explore" className="flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Explore Travelers
            </Link>
          </Button>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            Need help?{" "}
            <a href="#" className="text-primary hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
