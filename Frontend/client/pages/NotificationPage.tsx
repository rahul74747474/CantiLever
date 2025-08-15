import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import jwtDecode from "jwt-decode";

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

interface AppNotification {
  message: string;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let socket: ReturnType<typeof io> | null = null;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      socket = io("http://localhost:3000", {
        auth: { token },
        withCredentials: true,
      });

      if (decoded?.id) {
        socket.emit("identify", decoded.id);
      }

      fetch("http://localhost:3000/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            setNotifications(data.data);
          }
        })
        .catch((err) =>
          console.error("Failed to fetch notifications:", err)
        );

      socket.on("notification:new", (data: AppNotification) => {
        setNotifications((prev) => [data, ...prev]);

        // Guard Notification API usage
        if (typeof window !== "undefined" && "Notification" in window) {
          if (window.Notification.permission === "granted") {
            new window.Notification(data.message);
          } else if (window.Notification.permission !== "denied") {
            window.Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                new window.Notification(data.message);
              }
            });
          }
        }
      });
    } catch (error) {
      console.error("Error initializing notifications:", error);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <div className="space-y-2">
      {notifications.length === 0 && (
        <p className="text-sm text-muted-foreground">No notifications yet</p>
      )}
      {notifications.map((notif, i) => (
        <div
          key={i}
          className="bg-secondary border rounded p-2 text-sm text-foreground"
        >
          {notif.message}
        </div>
      ))}
    </div>
  );
}