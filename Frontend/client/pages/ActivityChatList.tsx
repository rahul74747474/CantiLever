import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  Send,
  ArrowLeft,
  Users,
  Calendar,
  MapPin,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
} from "lucide-react";

import axios from "../api/axios";
import { v4 as uuidv4 } from "uuid";

const SOCKET_SERVER_URL = "https://cantilever-uj6q.onrender.com";
// const SOCKET_SERVER_URL = "https://40z329b0-3000.inc1.devtunnels.ms";

// Define your types

interface Message {
  id: string | number;
  senderId: string;
  sender: string | {
    _id: any; firstName: string; lastName: string 
};
  message: string;
  timestamp: string;
  type?: string;
  tempId?: string;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isHost?: boolean;
}

interface Chat {
  activityName: string;
  activityDate: string;
  activityTime: string;
  location: string;
  participants: Participant[];
  messages: Message[];
}

export default function ActivityChatList() {
  const { chatId } = useParams<{ chatId: string }>();
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<any>(null);

  // Fetch chat & current user info on chatId change
  useEffect(() => {
    async function fetchChat() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<Chat>(`/trips/activities/${chatId}`);
        const res2 = await axios.get(`/users/me`);
        console.log(res2.data)
        setCurrentUserId(res2.data._id);
        setCurrentUserName(res2.data.firstName + " " + res2.data.lastName);
        setChat(res.data);
        setMessages(res.data.messages || []);
      } catch (err) {
        setError("Failed to load chat data.");
      } finally {
        setLoading(false);
      }
    }
    if (chatId) fetchChat();
  }, [chatId]);

  console.log(chat)
  

  // Setup socket connection & listeners
  useEffect(() => {
    if (!chatId) return;

    socketRef.current = io(SOCKET_SERVER_URL, { withCredentials: true });

    socketRef.current.on("connect", () => {
      console.log("Socket connected with id:", socketRef.current.id);
      socketRef.current.emit("joinActivity", chatId);
      console.log("Emitted joinActivity for chatId:", chatId);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socketRef.current.on("newMessage", (msg: Message) => {
      console.log("Received newMessage:", msg);
      setMessages((prev) => {
        if (msg.tempId) {
          return prev.map((m) => (m.tempId === msg.tempId ? msg : m));
        }
        return [...prev, msg];
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [chatId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() && socketRef.current) {
      const tempId = uuidv4(); // create a tempId for optimistic UI
      const msgPayload = {
        activityId: chatId,
        senderId: currentUserId,
        sender: currentUserName,
        message: message.trim(),
        tempId, // send tempId to server for correlation
      };

      socketRef.current.emit("sendMessage", msgPayload);

      // Add optimistic message locally with tempId
      setMessages((prev) => [
        ...prev,
        {
          id: tempId, // temporary id (can be same as tempId)
          sender: currentUserName,
          senderId: currentUserId,
          message: message.trim(),
          timestamp: new Date().toISOString(),
          type: "text",
          tempId,
        },
      ]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper: Format time nicely
  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Helper: Format date for grouping
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Group messages by date string
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: Record<string, Message[]> = {};
    messages.forEach((msg) => {
      const date = formatDate(msg.timestamp);
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (loading) return <div className="p-4 text-center">Loading chat...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;
  if (!chat) return <div className="p-4 text-center">Chat not found.</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-4 gap-6 h-[80vh]">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to="/chat">
                        <ArrowLeft className="w-4 h-4" />
                      </Link>
                    </Button>
                    <div>
                      <CardTitle className="text-lg">{chat.activityName}</CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(chat.activityDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {chat.location}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {Object.entries(messageGroups).map(([date, dayMessages]) => (
                      <div key={date}>
                        {/* Date Separator */}
                        <div className="flex items-center justify-center my-4">
                          <div className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                            {date}
                          </div>
                        </div>

                        {/* Messages for this date */}
                        <div className="space-y-3">
                          {dayMessages.map((msg, index) => {
                            const senderId =
                              msg.senderId?.toString() ||(typeof msg.sender === "string" ? msg.sender : msg.sender?._id?.toString()) ||"";
                            const currentId = currentUserId.toString();
                            const isCurrentUser = senderId === currentId;
                            console.log(senderId, currentUserId, isCurrentUser);
                            const participant = chat.participants.find(
                              (p) => p.id === msg.senderId
                            );
                            const key = msg.id || `${msg.timestamp}-${index}`;

                            return (
                              <div
                                key={key}
                                className={`flex items-start gap-3 ${isCurrentUser ? "flex-row-reverse" : ""
                                  }`}
                              >
                                {!isCurrentUser && (
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage
                                      src={participant?.avatar || undefined}
                                    />
                                    <AvatarFallback className="text-xs">
                                      {participant?.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("") || ""}
                                    </AvatarFallback>
                                  </Avatar>
                                )}

                                <div
                                  className={`max-w-[70%] ${isCurrentUser ? "text-right" : ""
                                    }`}
                                >
                                  {!isCurrentUser && (
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-medium text-foreground">
                                        {typeof msg.sender === "string"
                                          ? msg.sender
                                          : `${msg.sender.firstName} ${msg.sender.lastName}`}
                                      </span>
                                      {participant?.isHost && (
                                        <Badge variant="secondary" className="text-xs">
                                          Host
                                        </Badge>
                                      )}
                                    </div>
                                  )}

                                  <div
                                    className={`rounded-lg px-3 py-2 ${isCurrentUser
                                      ? "bg-primary text-primary-foreground ml-auto"
                                      : "bg-muted"
                                      }`}
                                  >
                                    <p className="text-sm whitespace-pre-wrap">
                                      {msg.message}
                                    </p>
                                  </div>

                                  <div
                                    className={`text-xs text-muted-foreground mt-1 ${isCurrentUser ? "text-right" : ""
                                      }`}
                                  >
                                    {formatTime(msg.timestamp)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2"
                      >
                        <Smile className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button onClick={handleSendMessage} disabled={!message.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Activity Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    {chat.activityName}
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(chat.activityDate).toLocaleDateString()} at{" "}
                        {chat.activityTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>{chat.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      <span>{chat.participants.length} participants</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participants */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Participants ({chat.participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {chat.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={participant.avatar || undefined} />
                        <AvatarFallback className="text-xs">
                          {participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {participant.name}
                            {participant.id === currentUserId && " (You)"}
                          </span>
                          {participant.isHost && (
                            <Badge variant="secondary" className="text-xs">
                              Host
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  View Activity Details
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Leave Activity
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
