import { useEffect, useState } from "react";

const DEFAULT_COORDS = { lat: 30.9, lon: 75.85 };

export function useUserCoordinates() {
  const [coords, setCoords] = useState(DEFAULT_COORDS);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("[Geo] Geolocation API unavailable, using default coords", DEFAULT_COORDS);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        console.log("[Geo] Geolocation success", nextCoords);
        setCoords(nextCoords);
      },
      (error) => {
        console.log("[Geo] Geolocation failed, using default coords", {
          code: error.code,
          message: error.message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000,
      }
    );
  }, []);

  return coords;
}
