import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import FloatingActionButtons from "@/components/FloatingActionButtons";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Calendar,
  Filter,
  Search,
  Map,
  Plane,
  MessageCircle,
  User,
  Users,
  Globe,
  Navigation,
} from "lucide-react";
import api from "../api/axios"

export default function mergedBuddies() {
   const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sameDestUserId, setSameDestUserId] = useState([]);
  const [sameDests, setSameDests] = useState([]);
  const [mergedBuddies, setMergedBuddies] = useState([]);
  const [sameDestUsers, setSameDestUsers] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("all");
  const [selectedTravelStyle, setSelectedTravelStyle] = useState("all");
  const [selectedAgeRange, setSelectedAgeRange] = useState("all");
  const [activeTab, setActiveTab] = useState("destination");

  useEffect(() => {
    api
      .get("/tb/same-dest", { withCredentials: true })
      .then((res3) => {
        setSameDests(res3.data.data);
        setSameDestUserId(res3.data.data.map(trip => trip.host));
      })
      .catch((err) => console.error("Error fetching upcoming trips:", err));
  }, []);

  useEffect(() => {
    if (!sameDestUserId.length) return;

    Promise.all(
      sameDestUserId.map((id) =>
        api.get(`/users/${id}`, { withCredentials: true }).then((res4) => res4.data.data)
      )
    )
      .then((users) => {
        setSameDestUsers(users);
      })
      .catch((err) => {
        console.error("Error fetching same destination users:", err);
      });
  }, [sameDestUserId]);

  useEffect(() => {
    if (!sameDests.length || !sameDestUsers.length) return;

    const merged = sameDests.map((trip) => {
      const user = sameDestUsers.find((u) => u._id === trip.host);

      return {
        id: user?._id,
        name: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
        bio: user?.bio || "",
        currentLocation: user?.location || "",
        nextDestination: trip.location || "",
        travelDates: trip.date
          ? new Date(trip.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          : "",
        avatar: user?.profilePicture || null,
        interests: user?.interests || [],
        distance: "", // optional
      };
    });

    setMergedBuddies(merged);
  }, [sameDests, sameDestUsers]);
  const myDestinations = [...new Set(
    sameDests
      .map(dest => dest.location?.trim().toLowerCase())
      .filter(Boolean) // remove null/undefined/empty
  )];
  console.log(myDestinations)

  // Merge trips & users into one array
  const filteredBuddies = mergedBuddies.filter((buddy) => {
    const matchesSearch =
      buddy.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buddy.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buddy.currentLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buddy.nextDestination?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDestination =
      !selectedDestination ||
      selectedDestination === "all" ||
      buddy.currentLocation?.trim().toLowerCase().includes(selectedDestination.trim().toLowerCase()) ||
      buddy.nextDestination?.trim().toLowerCase().includes(selectedDestination.trim().toLowerCase());


    return matchesSearch && matchesDestination;
  });

  const TravelBuddyCard = ({ buddy }: { buddy: (typeof mergedBuddies)[0] }) => (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={buddy.avatar || undefined} />
              <AvatarFallback>
                {buddy.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{buddy.name}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="w-3 h-3" />
                {buddy.currentLocation}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Navigation className="w-3 h-3" />
                {buddy.distance}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription>{buddy.bio}</CardDescription>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              Next destination:
            </span>
            <span className="text-muted-foreground">
              {buddy.nextDestination}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Travel dates:</span>
            <span className="text-muted-foreground">{buddy.travelDates}</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">
            Interests
          </h4>
          <div className="flex flex-wrap gap-1">
            {buddy.interests.map((interest) => (
              <Badge key={interest} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            className="flex-1"
            size="sm"
            onClick={() => navigate(`/profile/${buddy.id}`)}
          >
            <User className="w-4 h-4 mr-2" />
            View Profile
          </Button>

          <Button variant="outline" size="sm" className="flex-1">
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Travel Buddies
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover fellow travelers near you or heading to your destination
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <Label htmlFor="search" className="text-sm font-medium">
                    Search
                  </Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Name, location, or interests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <Label className="text-sm font-medium">Destination</Label>
                  <Select
                    value={selectedDestination}
                    onValueChange={setSelectedDestination}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Any destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any destination</SelectItem>
                      {[...new Set(sameDests.map((d) => d.location))]
                        .filter(Boolean) // remove empty/null
                        .sort((a, b) => a.localeCompare(b)) // sort alphabetically
                        .map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>




                {/* Clear Filters */}
                {(searchQuery ||
                  (selectedDestination && selectedDestination !== "all") ||
                  (selectedTravelStyle && selectedTravelStyle !== "all") ||
                  (selectedAgeRange && selectedAgeRange !== "all")) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedDestination("all");
                        setSelectedTravelStyle("all");
                        setSelectedAgeRange("all");
                      }}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Travel Buddies Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-1 max-w-md">
                <TabsTrigger value="destination">
                  Same Destination ({filteredBuddies.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="destination" className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Travelers Going to Your Destination
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredBuddies.map((buddy) => (
                      <TravelBuddyCard key={buddy.id || buddy.name} buddy={buddy} />
                    ))}
                  </div>
                  {filteredBuddies.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          No travelers found for this destination
                        </h3>
                        <p className="text-muted-foreground">
                          Be the first to plan a trip to this destination or try searching
                          for other locations
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

            </Tabs>
          </div>
        </div>

        <FloatingActionButtons showCreate={false} />
      </div>
    </div>
  );
}
