// ⛔️ DO NOT MODIFY THIS HEADER UNLESS YOU CHANGE FILE STRUCTURE
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "@/api/axios";
import { Button } from "@/components/ui/button";
// import { toast } from 'react-hot-toast';
import FloatingActionButtons from "@/components/FloatingActionButtons";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Search,
  Filter,
  Clock,
  Star,
  MessageCircle,
  Mountain,
  Utensils,
  Camera,
  Briefcase,
  Music,
  Waves,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const iconMap: Record<string, any> = {
  Hiking: Mountain,
  Food: Utensils,
  Photography: Camera,
  "Co-working": Briefcase,
  Music: Music,
  Surfing: Waves,
};

const categories = [
  "All",
  "Hiking",
  "Food",
  "Photography",
  "Co-working",
  "Music",
  "Surfing",
];

export default function Activities() {
  const [activities, setActivities] = useState<any[]>([]);
  const [joinedActivitiesData, setJoinedActivitiesData] = useState<any[]>([]);
  const [createdActivities, setCreatedActivities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [joinedActivities, setJoinedActivities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId, isAuthenticated } = useAuth();


  const fetchAll = async () => {
    try {
      const [exploreRes, joinedRes, createdRes] = await Promise.all([
        axios.get("/trips/activities"), // ✅ Explore
        axios.get("/trips/activities/my-joined-trips"), // ✅ Joined
        axios.get("/trips/my-activities"), // ✅ Created
      ]);

      const format = (data: any[]) =>
        data.map((activity: any) => ({
          ...activity,
          icon: iconMap[activity.category] || Mountain,
          host: {
            name: `${activity.host?.firstName || "Unknown"} ${
              activity.host?.lastName || ""
            }`,
            avatar: activity.host?.profilePicture || null,
            rating: activity.host?.rating || 4.8,
          },
        }));

      setActivities(format(exploreRes.data.data));
      setJoinedActivitiesData(format(joinedRes.data.data));
      setCreatedActivities(format(createdRes.data.data));
    } catch (err) {
      console.error("Failed to fetch activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchAll();
}, []);

  const handleJoin = async (activityId: string) => {
  try {
    await axios.post(`/trips/activities/${activityId}/join`);
    toast.success("Joined successfully!");

    // ✅ Refetch all activities to refresh the UI
    fetchAll();
  } catch (err) {
    console.error("Error joining activity:", err);
    toast.error("Failed to join activity");
  }
};


  const handleLeaveActivity = (id: string) => {
    setJoinedActivities((prev) => prev.filter((a) => a !== id));
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || activity.category === selectedCategory;

    const matchesDate = !selectedDate || activity.date === selectedDate;

    return matchesSearch && matchesCategory && matchesDate;
  });

  const ActivityCard = ({
    activity,
    showJoinButton = true,
  }: {
    activity: any;
    showJoinButton?: boolean;
  }) => {
    const Icon = activity.icon;
    const isJoined = joinedActivities.includes(activity._id);
    const isFull =
      activity.currentParticipants >= activity.maxParticipants;
    const spotsLeft = activity.maxParticipants - activity.currentParticipants;

    return (
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{activity.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {activity.category}
                  </Badge>
                  {isFull && (
                    <Badge variant="destructive" className="text-xs">
                      Full
                    </Badge>
                  )}
                  {isJoined && <Badge className="text-xs">Joined</Badge>}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-primary">₹{activity.price}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription>{activity.description}</CardDescription>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>
                {formatDate(activity.date)} at {activity.time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{activity.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>
                {activity.currentParticipants}/{activity.maxParticipants} participants
              </span>
              {spotsLeft <= 2 && spotsLeft > 0 && (
                <Badge variant="outline" className="text-xs">
                  {spotsLeft} spots left
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={activity.host.avatar || undefined} />
                <AvatarFallback className="text-xs">
                  {activity.host.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{activity.host.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">
                    {activity.host.rating}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {(activity.tags || []).slice(0, 2).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {showJoinButton && (
            <div className="flex gap-2 pt-2">
              {isJoined ? (
                <>
                  <Button
                    variant="outline"
                    className="flex-1"
                    size="sm"
                    onClick={() => handleLeaveActivity(activity._id)}
                  >
                    Leave Activity
                  </Button>
                  <Button asChild className="flex-1" size="sm">
                    <Link
                      to={`/chat/${activity._id}`}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </Link>
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full"
                  size="sm"
                  disabled={isFull}
                  onClick={() => handleJoin(activity._id)}
                >
                  {isFull ? "Activity Full" : `Join Activity - ₹${activity.price}`}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Activities
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover and join amazing activities with fellow travelers
            </p>
          </div>
          <Button asChild size="lg" className="mt-4 md:mt-0">
            <Link to="/create" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Activity
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="explore" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="joined">Joined</TabsTrigger>
            <TabsTrigger value="created">Created By Me</TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="search">Search Activities</Label>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by title, location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Category</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All");
                        setSelectedDate("");
                      }}
                      className="w-full"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Explore List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((activity) => (
                <ActivityCard key={activity._id} activity={activity} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="joined">
            {joinedActivitiesData.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    You haven't joined any activities yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Explore some activities to get started!
                  </p>
                  <Button asChild>
                    <Link to="/activities">Browse Activities</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {joinedActivitiesData.map((activity) => (
                  <ActivityCard
                    key={activity._id}
                    activity={activity}
                    showJoinButton={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="created">
            {createdActivities.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No created activities
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Create and host your own experiences.
                  </p>
                  <Button asChild>
                    <Link to="/create">Create Activity</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdActivities.map((activity) => (
                  <ActivityCard
                    key={activity._id}
                    activity={activity}
                    showJoinButton={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <FloatingActionButtons showProfile={false} />
      </div>
    </div>
  );
}
