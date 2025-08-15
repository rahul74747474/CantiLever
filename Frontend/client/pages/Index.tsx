import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Users,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Mountain,
  Plane,
  Camera,
} from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: MapPin,
      title: "Location Discovery",
      description: "Find travelers near you or in your destination city.",
    },
    {
      icon: Users,
      title: "Create & Join Activities",
      description:
        "Organize meetups, hikes, dinners and more with fellow travelers.",
    },
    {
      icon: MessageCircle,
      title: "Group Chat",
      description:
        "Connect with your activity group through built-in messaging.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-travel-blue-50 via-white to-travel-green-50">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="absolute top-20 left-10 text-travel-blue-200 animate-float">
          <Mountain className="w-12 h-12" />
        </div>
        <div
          className="absolute top-32 right-20 text-travel-green-200 animate-float"
          style={{ animationDelay: "1s" }}
        >
          <Plane className="w-10 h-10" />
        </div>
        <div
          className="absolute bottom-32 left-1/4 text-travel-blue-300 animate-float"
          style={{ animationDelay: "2s" }}
        >
          <Camera className="w-8 h-8" />
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                Meet Fellow Travelers.
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {" "}
                  Explore Together.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Find people nearby or connect with those going to the same
                place. Create memories and adventures with like-minded
                travelers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  asChild
                  className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Link to="/explore">Explore Now</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="text-lg px-8 py-3 border-2 hover:bg-primary/5 transition-all duration-300"
                >
                  <Link to="/signup">Sign Up Free</Link>
                </Button>
              </div>
            </div>

            {/* Hero Image Placeholder */}
            <div
              className="mt-16 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="relative max-w-4xl mx-auto">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-travel-blue-100 to-travel-green-100 shadow-2xl overflow-hidden">
                  <svg
                    viewBox="0 0 800 450"
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Sky gradient */}
                    <defs>
                      <linearGradient
                        id="sky"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#dbeafe" />
                        <stop offset="100%" stopColor="#bfdbfe" />
                      </linearGradient>
                      <linearGradient
                        id="mountain"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#6ee7b7" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>

                    {/* Background */}
                    <rect width="800" height="450" fill="url(#sky)" />

                    {/* Mountains */}
                    <polygon
                      points="0,300 200,150 400,250 600,100 800,200 800,450 0,450"
                      fill="url(#mountain)"
                      opacity="0.8"
                    />
                    <polygon
                      points="100,350 300,200 500,280 700,180 800,220 800,450 0,450"
                      fill="url(#mountain)"
                      opacity="0.6"
                    />

                    {/* Travelers silhouettes */}
                    <g fill="#1e40af" opacity="0.7">
                      <circle cx="300" cy="280" r="8" />
                      <rect x="296" y="288" width="8" height="20" rx="4" />
                      <circle cx="350" cy="285" r="8" />
                      <rect x="346" y="293" width="8" height="20" rx="4" />
                      <circle cx="320" cy="290" r="6" />
                      <rect x="317" y="296" width="6" height="15" rx="3" />
                    </g>

                    {/* Path */}
                    <path
                      d="M 200 400 Q 400 350 600 380"
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="none"
                      opacity="0.5"
                      strokeDasharray="10,5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to connect
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover travelers, plan activities, and make memories together
              with our comprehensive platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to start your next adventure?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have already discovered their
            perfect travel companions.
          </p>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Link to="/signup">Get Started Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link
                to="/"
                className="flex items-center gap-2 font-bold text-xl text-primary mb-4"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                TravelBuddy
              </Link>
              <p className="text-muted-foreground mb-4 max-w-md">
                Connect with fellow travelers and create unforgettable
                experiences together.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Twitter className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Platform</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    to="/explore"
                    className="hover:text-primary transition-colors"
                  >
                    Explore
                  </Link>
                </li>
                <li>
                  <Link
                    to="/trips"
                    className="hover:text-primary transition-colors"
                  >
                    My Trips
                  </Link>
                </li>
                <li>
                  <Link
                    to="/activities"
                    className="hover:text-primary transition-colors"
                  >
                    Activities
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="hover:text-primary transition-colors"
                  >
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 TravelBuddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
