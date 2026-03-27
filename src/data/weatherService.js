const WEATHER_FALLBACKS = [
  {
    location: "Punjab",
    temperature: 27,
    windSpeed: 10,
    precipitationChance: 22,
    description: "Partly cloudy with mild breeze",
  },
  {
    location: "Haryana",
    temperature: 29,
    windSpeed: 14,
    precipitationChance: 35,
    description: "Warm afternoon with scattered clouds",
  },
];

function randomDelay() {
  return 800 + Math.floor(Math.random() * 700);
}

function toWeatherPayload(apiJson, lat, lon) {
  const current = apiJson?.current;
  return {
    location: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
    temperature: Math.round(current?.temperature_2m ?? 0),
    windSpeed: Math.round(current?.wind_speed_10m ?? 0),
    precipitationChance: Math.round(apiJson?.daily?.precipitation_probability_max?.[0] ?? 0),
    description: "Live weather from Open-Meteo",
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchWeather(lat = 30.90, lon = 75.85) {
  const delay = randomDelay();
  console.log("[Weather] Fetch started", { lat, lon, delay });
  await new Promise((resolve) => setTimeout(resolve, delay));

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&daily=precipitation_probability_max&forecast_days=1&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP ${response.status}`);
    }

    const data = await response.json();
    const payload = toWeatherPayload(data, lat, lon);
    console.log("[Weather] Open-Meteo success", payload);
    return payload;
  } catch (error) {
    console.log("[Weather] Open-Meteo failed, using mock fallback", { message: error.message });
    const fallback = WEATHER_FALLBACKS[Math.floor(Math.random() * WEATHER_FALLBACKS.length)];
    const payload = {
      ...fallback,
      description: `${fallback.description} (mock fallback)`,
      fetchedAt: new Date().toISOString(),
      isFallback: true,
    };
    console.log("[MockAPI] Weather fallback response", payload);
    return payload;
  }
}
