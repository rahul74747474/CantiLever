import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import api from "../api/axios"; // your axios instance

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 23.2599,
  lng: 77.4126,
};

export default function Maps() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [upcomingTrips, setUpcomingTrips] = useState<any[]>([]);

  // Get user's geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => setLocationError(err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // Fetch upcoming trips from backend
  useEffect(() => {
    api
      .get("/trips/activities/my-upcoming-trips")
      .then((res) => {
        // Convert location string into lat/lng object
        const tripsWithCoords = res.data.map((trip: any) => {
          let lat = null;
          let lng = null;
          if (trip.location) {
            const [latStr, lngStr] = trip.location.split(",").map((coord: string) => coord.trim());
            lat = parseFloat(latStr);
            lng = parseFloat(lngStr);
          }
          return {
            ...trip,
            lat,
            lng,
          };
        });
        setUpcomingTrips(tripsWithCoords);
      })
      .catch((err) => {
        console.error("Failed to fetch upcoming trips:", err);
      });
  }, []);

  // Center map
  const center = userLocation || defaultCenter;

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={userLocation ? 12 : 5}>
        
        {/* Show user location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            title="Your Location"
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />
        )}

        {/* Show upcoming trips markers */}
        {upcomingTrips
          .filter((trip) => trip.lat && trip.lng)
          .map((trip) => (
            <Marker
              key={trip._id}
              position={{ lat: trip.lat, lng: trip.lng }}
              title={`${trip.destination || "Trip"} - ${trip.date || ""}`}
            />
          ))}
      </GoogleMap>
    </LoadScript>
  );
}
