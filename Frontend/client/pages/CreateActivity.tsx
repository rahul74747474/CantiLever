import { useState } from "react";
import { useNavigate } from "react-router-dom";
 import axios from "@/api/axios";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Tag,
  ArrowLeft,
  ArrowRight,
  Mountain,
  Utensils,
  Camera,
  Briefcase,
  Music,
  Waves,
  Clock,
  Star,
  Eye,
  Send,
} from "lucide-react";

const categories = [
  { value: "Hiking", label: "Hiking", icon: Mountain },
  { value: "Food", label: "Food & Dining", icon: Utensils },
  { value: "Photography", label: "Photography", icon: Camera },
  { value: "Co-working", label: "Co-working", icon: Briefcase },
  { value: "Music", label: "Music & Entertainment", icon: Music },
  { value: "Surfing", label: "Beach & Water Sports", icon: Waves },
];

const predefinedTags = [
  "Adventure",
  "Nature",
  "Culture",
  "Food",
  "Photography",
  "Beach",
  "Music",
  "Art",
  "Nightlife",
  "Local",
  "Budget-friendly",
  "Luxury",
  "Family-friendly",
  "Solo-friendly",
  "Networking",
  "Learning",
];

export default function CreateActivity() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    maxParticipants: "",
    price: "",
    tags: [] as string[],
  });

  const [customTag, setCustomTag] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !formData.tags.includes(customTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, customTag.trim()] });
      setCustomTag("");
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.title.trim() &&
          formData.description.trim() &&
          formData.category
        );
      case 2:
        return formData.date && formData.time && formData.location.trim();
      case 3:
        return formData.maxParticipants && formData.price;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsPreviewMode(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
 // your configured axios instance

const handleSubmit = async () => {
  try {
    await axios.post("/trips/", formData);
    navigate("/trips"); // after success
  } catch (error) {
    console.error("Activity submission failed:", error);
    alert("Failed to create activity. Try again.");
  }
};

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const selectedCategory = categories.find(
    (cat) => cat.value === formData.category,
  );

  if (isPreviewMode) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => setIsPreviewMode(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Edit
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Preview Activity
              </h1>
              <p className="text-muted-foreground">
                Review your activity before publishing
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        {selectedCategory && (
                          <selectedCategory.icon className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {formData.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {formData.category}
                          </Badge>
                          <Badge className="text-xs">New</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary text-lg">
                        ${formData.price}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base">
                    {formData.description}
                  </CardDescription>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {formatDate(formData.date)} at {formData.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{formData.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>Up to {formData.maxParticipants} participants</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">YU</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">You (Host)</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">
                            New Host
                          </span>
                        </div>
                      </div>
                    </div>

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {formData.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {formData.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{formData.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <Button className="w-full" size="lg" disabled>
                    <Users className="w-4 h-4 mr-2" />
                    Join Activity - ${formData.price}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publishing Options</CardTitle>
                  <CardDescription>
                    Choose how to share your activity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handleSubmit} size="lg" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Publish Activity
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                </CardContent>
              </Card>

              {formData.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/activities")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Activities
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Create New Activity
            </h1>
            <p className="text-muted-foreground">
              Share an amazing experience with fellow travelers
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-0.5 ml-4 ${
                      step < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>
              Step {currentStep} of 3:{" "}
              {currentStep === 1
                ? "Basic Information"
                : currentStep === 2
                  ? "Date & Location"
                  : "Participants & Pricing"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1
                ? "Tell us about your activity"
                : currentStep === 2
                  ? "When and where will it happen?"
                  : "Set the group size and cost"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <>
                <div>
                  <Label htmlFor="title">Activity Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Mount Fuji Sunrise Hike"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your activity in detail..."
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <category.icon className="w-4 h-4" />
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        handleInputChange("time", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Mount Fuji, Japan"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                  />
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxParticipants">Max Participants</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      min="1"
                      max="50"
                      placeholder="8"
                      value={formData.maxParticipants}
                      onChange={(e) =>
                        handleInputChange("maxParticipants", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (USD)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="25.00"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Tags (Optional)</Label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {predefinedTags.map((tag) => (
                        <Button
                          key={tag}
                          variant={
                            formData.tags.includes(tag) ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            formData.tags.includes(tag)
                              ? handleRemoveTag(tag)
                              : handleAddTag(tag)
                          }
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Add custom tag..."
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustomTag();
                          }
                        }}
                      />
                      <Button onClick={handleAddCustomTag} variant="outline">
                        Add
                      </Button>
                    </div>

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={handleNextStep}
                disabled={!isStepValid(currentStep)}
              >
                {currentStep === 3 ? "Preview Activity" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
