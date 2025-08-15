// components/InviteModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "@/api/axios";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
}

export default function InviteModal({ isOpen, onClose, targetUserId }: InviteModalProps) {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get("/trips/my-activities");
        setActivities(res.data.data);
      } catch (err) {
        console.error("Error fetching activities:", err);
      }
    };

    if (isOpen) fetchActivities();
  }, [isOpen]);

  const handleInvite = async (activityId: string) => {
    try {
      await axios.post(`/invitations/send`, { activityId, inviteeId: targetUserId });
      alert("Invitation sent!");
      onClose();
    } catch (err) {
      console.error("Invite failed:", err);
      alert("Failed to send invitation");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select an Activity to Invite</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity._id} className="flex justify-between items-center border p-2 rounded">
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.location}</p>
              </div>
              <Button onClick={() => handleInvite(activity._id)} size="sm">Invite</Button>
            </div>
          ))}
          {activities.length === 0 && <p className="text-muted-foreground">No activities found.</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
