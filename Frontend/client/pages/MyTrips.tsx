import { useEffect, useState } from "react";
import axios from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Plane,
  Clock,
  Globe,
} from "lucide-react";
import FloatingActionButtons from "@/components/FloatingActionButtons";

export default function MyTrips() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const fetchTrips = async () => {
    try {
      const res = await axios.get("/trips/activities/my-upcoming-trips");
      console.log("Fetched:", res.data.data);
      setTrips(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch trips:", err);
      setError("Could not load your trips.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const tripDate = new Date(dateString);
    const diffTime = tripDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const upcomingTrips = trips.filter((trip) => new Date(trip.date) >= new Date());
  const completedTrips = trips.filter((trip) => new Date(trip.date) < new Date());

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Trips</h1>
            <p className="text-muted-foreground text-lg">
              View and manage your travel plans.
            </p>
          </div>
        </div>

        {loading && <p>Loading your trips...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && upcomingTrips.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Plane className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No upcoming trips yet</h3>
              <p className="text-muted-foreground mb-6">
                Add a trip to connect with other travelers.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add New Trip
              </Button>
            </CardContent>
          </Card>
        )}

        {/* UPCOMING TRIPS */}
        {upcomingTrips.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Upcoming Trips</h2>
              <Badge variant="secondary">{upcomingTrips.length}</Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {upcomingTrips.map((trip) => (
                <Card key={trip._id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div className="flex gap-3">
                        <Globe className="w-6 h-6 text-primary" />
                        <div>
                          <CardTitle>{trip.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(trip.date)}{" "}
                            {trip.time && `at ${trip.time}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {trip.location}
                          </p>
                        </div>
                      </div>
                      <Badge>{getDaysUntil(trip.date)} days to go</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-muted-foreground">
                      {trip.description || "No description"}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {(trip.tags || []).slice(0, 4).map((tag: string) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Max: {trip.maxParticipants} | Price: ₹{trip.price}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* COMPLETED TRIPS */}
        {completedTrips.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-6 h-6 text-muted-foreground" />
              <h2 className="text-2xl font-semibold">Past Trips</h2>
              <Badge variant="outline">{completedTrips.length}</Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {completedTrips.map((trip) => (
                <Card key={trip._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{trip.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(trip.date)}{" "}
                          {trip.time && `at ${trip.time}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {trip.description || "No description"}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <FloatingActionButtons />
      </div>
    </div>
  );
}
