import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import FloatingActionButtons from "@/components/FloatingActionButtons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Edit,
  Camera,
  MapPin,
  Calendar,
  Star,
  Upload,
  Save,
  Settings,
  Globe,
  Languages,
  Heart,
  MessageCircle,
  Users,
} from "lucide-react";

import axios from "axios";
import api from "../api/axios"

export default function Profile() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
  name: "",
  avatar: "",
  location: "",
  bio: "",
  languages: [],
  interests: [],
  joinDate: "",
  rating: 0,
  totalActivities: 0,
  email: ""
});

  const [newInterest, setNewInterest] = useState("");
  const [userProfile, setUserProfile] = useState({
  name: "",
  avatar: "",
  location: "",
  bio: "",
  languages: [],
  interests: [],
  joinDate: "",
  rating: 0,
  totalActivities: 0,
  email: ""
});
const [upcomingDestinations, setUpcomingDestinations] = useState<any[]>([]);
const [joinedActivities, setJoinedActivities] = useState([]);


useEffect(() => {
  api.get("/users/me", { withCredentials: true })
    .then((res) => {
      const data = res.data;
      const formattedProfile = {
        name: `${data.firstName?.trim() || ""} ${data.lastName?.trim() || ""}`,
        avatar: data.image?.url || "",
        location: data.location || "",
        bio: data.bio || "",
        languages: [],
        interests: data.interests || [],
        joinDate: data.createdAt || "",
        rating: 4.8,
        totalActivities: data.joinedActivities?.length || 0,
        email: data.email || ""
      };
      setUserProfile(formattedProfile);
    })
    .catch((err) => console.error("Error fetching profile:", err));
}, []);


useEffect(() => {
  api
    .get("/trips/activities/my-upcoming-trips", { withCredentials: true })
    .then((res) => {
      setUpcomingDestinations(res.data.data); // Must be array
    })
    .catch((err) => console.error("Error fetching upcoming trips:", err));
}, []);

useEffect(() => {
  api
    .get("/trips/activities/my-joined-trips", { withCredentials: true })
    .then((res) => setJoinedActivities(res.data.data))
    .catch((err) =>
      console.error("Error fetching joined activities:", err)
    );
}, []);


useEffect(() => {
  if (userProfile) {
    setEditedProfile(userProfile);
  }
}, [userProfile]);


  const handleSaveProfile = async () => {
  try {
    const res = await axios.put("/api/v1/users/me", editedProfile, {
      withCredentials: true,
    });
    setUserProfile(res.data); // update main profile
    setIsEditDialogOpen(false);
  } catch (err) {
    console.error("Failed to save profile", err);
  }
};

  const handleAddInterest = () => {
    if (
      newInterest.trim() &&
      !editedProfile.interests.includes(newInterest.trim())
    ) {
      setEditedProfile({
        ...editedProfile,
        interests: [...editedProfile.interests, newInterest.trim()],
      });
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setEditedProfile({
      ...editedProfile,
      interests: editedProfile.interests.filter((i) => i !== interest),
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
    {!userProfile ? (
      <div className="p-8 text-center text-muted-foreground">Loading...</div>
    ) : (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={userProfile.avatar || undefined} />
                  <AvatarFallback className="text-3xl">
  {(userProfile.name || "")
    .split(" ")
    .map((n) => n[0])
    .join("")}
</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute -bottom-2 -right-2 rounded-full shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {userProfile.name}
                    </h1>
                    <div className="flex items-center gap-4 text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {userProfile.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined {formatDate(userProfile.joinDate)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {userProfile.rating}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          ({userProfile.totalActivities} activities)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Languages className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {userProfile.languages?.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-foreground mb-4 leading-relaxed">
                  {userProfile.bio}
                </p>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.interests?.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="destinations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="destinations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Upcoming Destinations
                </CardTitle>
                <CardDescription>
                  Places you're planning to visit
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingDestinations.length === 0 ? (
                  <div className="text-center py-8">
                    <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No upcoming destinations
                    </p>
                    <Button>Add Your First Trip</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingDestinations?.map((destination) => (
                      <div
                        key={destination._id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">
                              {destination.location}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {destination.date}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            destination.status === "confirmed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {destination.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account preferences and privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userProfile.email}
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <FloatingActionButtons showProfile={false} />
      </div>
    </div>
  )
}
</>
)
}

