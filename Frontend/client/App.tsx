import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import TravelBuddies from "./pages/TravelBuddies";
import MyTrips from "./pages/MyTrips";
import Activities from "./pages/Activities";
import CreateActivity from "./pages/CreateActivity";
import Chat from "./pages/Chat";
import ActivityChatList from "./pages/ActivityChatList";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotificationPage from "./pages/NotificationPage";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "../context/AuthContext";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      {!hideNavbar && <Navbar />}
      <main className={hideNavbar ? "" : ""}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/trips" element={<MyTrips />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/create" element={<CreateActivity />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:chatId" element={<ActivityChatList />} />
          <Route path="/travel-buddies" element={<TravelBuddies />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
        { /* <Route path="/notification" element={<NotificationPage/>} /> */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
