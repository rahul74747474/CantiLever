import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios"; // using your configured Axios instance
import { Button } from "@/components/ui/button";
import FloatingActionButtons from "@/components/FloatingActionButtons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  MessageCircle,
  Calendar,
  MapPin,
  Users,
  Settings,
  Plane,
  Camera,
  Mountain,
} from "lucide-react";
import Maps from "./Maps";
import { upcomingTrips } from "@/data/upcomingTrip";

const quickStats = [
  { label: "Active Trips", value: "2", icon: Calendar },
  { label: "Joined Activities", value: "8", icon: Users },
  { label: "New Matches", value: "13", icon: MapPin },
  { label: "Messages", value: "6", icon: MessageCircle },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<{ id: string; destination: string; date: string }[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [userName, setUserName] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/users/me"); // token is auto-added in axios instance
        const { firstName, lastName } = res.data;
        setUserName(`${firstName} ${lastName}`);
      } catch (err: any) {
        console.error("Failed to fetch user data:", err);
        const status = err.response?.status;
        if (status === 401) {
          setError("Session expired. Please login again.");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/login"), 1500);
        } else {
          setError("Failed to fetch user data. Please try again.");
        }
      }
    };
    const fetchTrips = async () => {
  try {
    const res = await axios.get("/trips/activities/my-upcoming-trips");
    const rawTrips = res.data?.data || [];

    const formatted = rawTrips.map((trip: any) => ({
      id: trip._id,
      destination: trip.location, // ⚠️ backend field is `location`
      date: new Date(trip.date).toISOString().split("T")[0], // Format to YYYY-MM-DD
    }));

    setTrips(formatted);
  } catch (err) {
    console.error("Failed to fetch trips", err);
  } finally {
    setLoadingTrips(false);
  }
};
    fetchTrips();


    fetchUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-travel-blue-50 via-white to-travel-green-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Banner */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-accent p-8 text-white">
          <div className="absolute top-4 right-8 text-white/20 animate-float">
            <Mountain className="w-16 h-16" />
          </div>
          <div className="absolute bottom-4 right-16 text-white/20 animate-float" style={{ animationDelay: "1s" }}>
            <Plane className="w-12 h-12" />
          </div>
          <div className="absolute top-8 right-32 text-white/20 animate-float" style={{ animationDelay: "2s" }}>
            <Camera className="w-8 h-8" />
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {userName || "Traveler"}! 👋
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Your next adventure awaits. Discover new travel companions and exciting activities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="secondary" size="lg" className="shadow-lg">
                <Link to="/create" className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create Activity
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Link to="/profile" className="flex items-center gap-2">
                  Profile
                </Link>
              </Button>
            </div>

            {/* Error message if exists */}
            {error && (
              <div className="mt-4 p-3 rounded-md bg-red-500/20 text-sm text-white border border-red-400/40">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Future sections: Quick stats, trips, chats etc. */}
        <FloatingActionButtons />
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Upcoming Trips</h2>

          <Maps />

          <div className="mt-4">
            {loadingTrips ? (
              <p className="text-muted-foreground">Loading trips...</p>
            ) : trips.length === 0 ? (
              <p className="text-muted-foreground">No upcoming trips found.</p>
            ) : (
              <ul className="space-y-2">
                {trips.map((trip) => (
                  <li key={trip.id} className="p-3 border rounded-md shadow-sm bg-white">
                    <p className="font-medium">{trip.destination}</p>
                    <p className="text-sm text-muted-foreground">{trip.date}</p>
                  </li>
                ))}
              </ul>
            )}

          </div>
        </div>
      </div>
    </div>

  );
}
