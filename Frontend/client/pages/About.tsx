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
  Globe,
  Heart,
  Star,
  Compass,
  Camera,
  MessageCircle,
  Shield,
  Award,
  Zap,
  Mountain,
  Plane,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Global Community",
    description:
      "Connect with travelers from over 150 countries and discover new perspectives.",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description:
      "Verified profiles and secure messaging ensure your safety while traveling.",
  },
  {
    icon: MessageCircle,
    title: "Real-time Chat",
    description:
      "Instant messaging and group chats help you coordinate activities effortlessly.",
  },
  {
    icon: Star,
    title: "Quality Activities",
    description:
      "Curated experiences and user ratings ensure memorable adventures.",
  },
];

const stats = [
  { number: "50K+", label: "Active Travelers" },
  { number: "200K+", label: "Activities Created" },
  { number: "150+", label: "Countries" },
  { number: "4.9", label: "Average Rating" },
];

const team = [
  {
    name: "Sarah Chen",
    role: "Founder & CEO",
    bio: "Digital nomad with 10+ years of travel experience. Passionate about connecting people through shared adventures.",
    avatar: null,
  },
  {
    name: "Alex Rivera",
    role: "CTO",
    bio: "Tech enthusiast who believes technology can bring people together. Former software engineer at major tech companies.",
    avatar: null,
  },
  {
    name: "Emma Johnson",
    role: "Head of Community",
    bio: "Community building expert who loves creating meaningful connections between travelers worldwide.",
    avatar: null,
  },
  {
    name: "Marco Silva",
    role: "Head of Safety",
    bio: "Former travel guide with expertise in travel safety and risk management. Ensures our platform remains secure.",
    avatar: null,
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-travel-blue-50 via-white to-travel-green-50 py-20">
        {/* Background Elements */}
        <div className="absolute top-20 left-10 text-travel-blue-200 animate-float">
          <Mountain className="w-16 h-16" />
        </div>
        <div
          className="absolute top-32 right-20 text-travel-green-200 animate-float"
          style={{ animationDelay: "1s" }}
        >
          <Plane className="w-12 h-12" />
        </div>
        <div
          className="absolute bottom-32 left-1/4 text-travel-blue-300 animate-float"
          style={{ animationDelay: "2s" }}
        >
          <Camera className="w-10 h-10" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Connecting Travelers
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}
                Worldwide
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              TravelBuddy was born from a simple idea: travel is better when
              shared. We bring together like-minded explorers to create
              unforgettable experiences around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/signup" className="text-lg px-8 py-3">
                  Join Our Community
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/explore" className="text-lg px-8 py-3">
                  Explore Activities
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <p className="text-xl text-muted-foreground">
                How a chance encounter in a Tokyo hostel led to a global
                community
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  In 2022, our founder Sarah was traveling solo through Japan
                  when she met Alex, a fellow photographer, in a crowded Tokyo
                  hostel. They ended up exploring hidden temples together,
                  sharing stories over ramen, and creating memories that would
                  last a lifetime.
                </p>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  This experience sparked an idea: what if there was an easier
                  way for travelers to find each other? Not just for dating or
                  networking, but for genuine shared experiences and adventures.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Today, TravelBuddy connects thousands of explorers worldwide,
                  helping them discover new places, cultures, and friendships
                  that transcend borders.
                </p>
              </div>
              <div className="bg-gradient-to-br from-travel-blue-100 to-travel-green-100 rounded-2xl p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <blockquote className="text-lg italic text-foreground mb-4">
                  "Travel opens your mind, but traveling with others opens your
                  heart."
                </blockquote>
                <cite className="text-sm text-muted-foreground">
                  — Sarah Chen, Founder
                </cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why Choose TravelBuddy?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We've built the features that matter most to modern travelers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl mb-8 leading-relaxed opacity-90">
              To break down barriers between cultures and create a world where
              every traveler can find their tribe, no matter where they are on
              the globe.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <Users className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Build Community</h3>
                <p className="opacity-90">
                  Foster genuine connections between travelers
                </p>
              </div>
              <div>
                <Compass className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Enable Discovery</h3>
                <p className="opacity-90">
                  Help travelers discover hidden gems and local experiences
                </p>
              </div>
              <div>
                <Zap className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Spark Adventure</h3>
                <p className="opacity-90">
                  Inspire people to step out of their comfort zones
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Passionate travelers and technologists working to connect the
              world
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of travelers who have already found their perfect
              travel companions.
            </p>
            <Button size="lg" asChild>
              <Link to="/signup" className="text-lg px-8 py-3">
                Get Started Today
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
