import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axios from "../api/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Navigation,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Mountain,
  Plane,
  Camera,
  Upload,
} from "lucide-react";

export default function Signup() {
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsFetchingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
          );
          const data = await response.json();

          if (
            data.status === "OK" &&
            data.results &&
            data.results.length > 0
          ) {
            const address = data.results[0].formatted_address;
            handleInputChange("location", address);
          } else {
            handleInputChange(
              "location",
              `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            );
          }
        } catch {
          handleInputChange(
            "location",
            `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          );
        }

        setIsFetchingLocation(false);
      },
      (error) => {
        alert("Unable to retrieve your location");
        setIsFetchingLocation(false);
      }
    );
  };


  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    // Step 2: Profile Setup
    bio: "",
    location: "",
    interests: [] as string[],
    image: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const predefinedInterests = [
    "Hiking",
    "Photography",
    "Food",
    "Culture",
    "Beach",
    "Adventure",
    "Museums",
    "Local Markets",
    "Nightlife",
    "Co-working",
    "Architecture",
    "Nature",
    "Music",
    "Art",
    "Sports",
    "History",
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleInterestToggle = (interest: string) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter((i) => i !== interest)
      : [...formData.interests, interest];

    setFormData({ ...formData, interests: newInterests });
  };

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.bio.trim()) {
      newErrors.bio = "Please add a short bio";
    } else if (formData.bio.length < 20) {
      newErrors.bio = "Bio should be at least 20 characters";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Please add your location";
    }

    if (formData.interests.length < 3) {
      newErrors.interests = "Please select at least 3 interests";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) return;
    setIsLoading(true);

    try {
      const form = new FormData();
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("email", formData.email);
      form.append("password", formData.password);
      form.append("bio", formData.bio);
      form.append("location", formData.location);
      formData.interests.forEach((interest) => form.append("interests", interest));
      if (formData.image) {
        form.append("image", formData.image); // append image file
      }
      for (const [key, value] of form.entries()) {
        console.log(`${key}:`, value);
      }
      const response = await axios.post("/users/signup", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Signup error:", error); // Add this line
      const message = error.response?.data?.message || "Signup failed. Please try again.";
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`Signup with ${provider}`);
    // Here you would integrate with actual social signup
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, image: null });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-travel-blue-50 via-white to-travel-green-50 flex items-center justify-center px-4 py-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
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
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-bold text-2xl text-primary hover:text-primary/80 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            TravelBuddy
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                    }`}
                >
                  {step}
                </div>
                {step < 2 && (
                  <div
                    className={`w-16 h-0.5 ml-4 ${step < currentStep ? "bg-primary" : "bg-muted"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">
              {currentStep === 1 ? "Create Account" : "Complete Your Profile"}
            </CardTitle>
            <CardDescription className="text-lg">
              {currentStep === 1
                ? "Join the TravelBuddy community"
                : "Tell us about yourself and your interests"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {errors.general && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {errors.general}
              </div>
            )}

            {currentStep === 1 ? (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Sign up with email
                    </span>
                  </div>
                </div>

                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative mt-2">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          className={`pl-10 ${errors.firstName ? "border-destructive" : ""}`}
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative mt-2">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          className={`pl-10 ${errors.lastName ? "border-destructive" : ""}`}
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        className={`pl-10 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) =>
                          handleInputChange("agreeToTerms", checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="agreeToTerms"
                        className="text-sm cursor-pointer"
                      >
                        I agree to the{" "}
                        <Link to="#" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="#" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    {errors.agreeToTerms && (
                      <p className="text-destructive text-sm">
                        {errors.agreeToTerms}
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full"
                    size="lg"
                  >
                    Continue
                  </Button>
                </form>
              </>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself and your travel interests..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={3}
                    className={errors.bio ? "border-destructive" : ""}
                  />
                  {errors.bio && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.bio}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="location">Current Location</Label>
                  <div className="relative mt-2 flex items-center">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="e.g., New York, USA"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className={`pl-10 ${errors.location ? "border-destructive" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={fetchCurrentLocation}
                      disabled={isFetchingLocation}
                      className="ml-2 px-3 py-1 rounded bg-primary text-white hover:bg-primary/80 disabled:opacity-50"
                      title="Use Current Location"
                    >
                      <Navigation className="w-4 h-4" />
                    </button>
                  </div>
                  {errors.location && (
                    <p className="text-destructive text-sm mt-1">{errors.location}</p>
                  )}
                </div>


                <div>
                  <Label>Interests (Select at least 3)</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {predefinedInterests.map((interest) => (
                      <Button
                        key={interest}
                        type="button"
                        variant={
                          formData.interests.includes(interest)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleInterestToggle(interest)}
                        className="text-xs"
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                  {errors.interests && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.interests}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>

                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2"
                    onChange={handleFileChange}
                  />

                  {formData.image && (
                    <div className="mt-3 flex justify-center">
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Preview"
                        className="h-24 w-24 rounded-full object-cover border"
                      />
                    </div>
                  )}
                </div>







                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousStep}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            )}

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
