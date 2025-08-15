import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";  // your axios instance

export default function ActivityChatList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/trips/activities/my-upcoming-trips", { withCredentials: true })
      .then((res) => {
        setActivities(res.data.data || []);
      })
      .catch(() => {
        setError("Failed to load activities");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading activities...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-md mx-auto bg-white rounded shadow p-4">
     <h2 className="text-xl font-semibold mb-4 bg-white sticky top-0 z-10 border-b border-gray-200 py-2">
  Your Activity Chats
</h2>
      <ul>
        {activities.length === 0 && <li>No joined activities yet.</li>}
        {activities.map((activity) => (
          <li key={activity._id} className="border-b py-2">
            <Link
              to={`/chat/${activity._id}`}
              className="block hover:bg-gray-100 p-2 rounded"
            >
              <div className="font-medium">{activity.title}</div>
              <div className="text-sm text-gray-500">
                {new Date(activity.date).toLocaleDateString()} at {activity.time}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}