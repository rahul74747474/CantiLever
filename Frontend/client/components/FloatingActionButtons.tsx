import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonsProps {
  showChat?: boolean;
  showProfile?: boolean;
  showCreate?: boolean;
  className?: string;
}

export default function FloatingActionButtons({
  showChat = true,
  showProfile = true,
  showCreate = true,
  className,
}: FloatingActionButtonsProps) {
  const buttons = [];

  if (showCreate) {
    buttons.push({
      href: "/create",
      icon: Plus,
      label: "Create Activity",
      color: "bg-primary hover:bg-primary/90",
    });
  }

  if (showChat) {
    buttons.push({
      href: "/chat",
      icon: MessageCircle,
      label: "Messages",
      color: "bg-accent hover:bg-accent/90",
    });
  }

  if (showProfile) {
    buttons.push({
      href: "/profile",
      icon: User,
      label: "Profile",
      color: "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
    });
  }

  if (buttons.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col gap-3",
        className,
      )}
    >
      {buttons.map((button, index) => {
        const Icon = button.icon;
        return (
          <Button
            key={button.href}
            asChild
            size="icon"
            className={cn(
              "h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110",
              button.color,
              {
                "animate-fade-in": true,
              },
            )}
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <Link
              to={button.href}
              className="group relative"
              title={button.label}
            >
              <Icon className="w-6 h-6" />

              {/* Tooltip */}
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {button.label}
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-foreground"></div>
              </div>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
