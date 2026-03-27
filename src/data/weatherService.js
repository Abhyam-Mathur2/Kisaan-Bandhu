const WEATHER_FALLBACKS = [
  {
    location: "Punjab",
    temperature: 27,
    humidity: 56,
    windSpeed: 10,
    precipitationChance: 22,
    description: "Partly cloudy with mild breeze",
  },
  {
    location: "Haryana",
    temperature: 29,
    humidity: 49,
    windSpeed: 14,
    precipitationChance: 35,
    description: "Warm afternoon with scattered clouds",
  },
];

function randomDelay() {
  return 800 + Math.floor(Math.random() * 700);
}

function buildRainPrediction(forecastJson) {
  const items = Array.isArray(forecastJson?.list) ? forecastJson.list.slice(0, 8) : [];

  if (items.length === 0) {
    return {
      chance24h: 0,
      expectedRainMm24h: 0,
      likelyStartLocal: null,
      hourlyChances: [],
    };
  }

  const hourlyChances = items.map((item) => Math.round((item?.pop || 0) * 100));
  const chance24h = Math.max(...hourlyChances);
  const expectedRainMm24h = Math.round(
    items.reduce((sum, item) => sum + Number(item?.rain?.["3h"] || 0), 0)
  );

  const likelyStart = items.find((item) => (item?.pop || 0) >= 0.4);
  const likelyStartLocal = likelyStart?.dt_txt
    ? new Date(likelyStart.dt_txt).toLocaleString()
    : null;

  return {
    chance24h,
    expectedRainMm24h,
    likelyStartLocal,
    hourlyChances,
  };
}

function toWeatherPayload(currentJson, forecastJson, lat, lon) {
  const firstForecast = forecastJson?.list?.[0] || {};
  const rainPrediction = buildRainPrediction(forecastJson);
  const city = currentJson?.name;
  const country = currentJson?.sys?.country;
  const readableLocation = city && country
    ? `${city}, ${country}`
    : city || `${lat.toFixed(2)}, ${lon.toFixed(2)}`;

  return {
    location: readableLocation,
    temperature: Math.round(currentJson?.main?.temp ?? 0),
    humidity: Math.round(currentJson?.main?.humidity ?? 0),
    windSpeed: Math.round(currentJson?.wind?.speed ?? 0),
    precipitationChance: rainPrediction.chance24h || Math.round((firstForecast?.pop || 0) * 100),
    description: currentJson?.weather?.[0]?.description || "Live weather from OpenWeather",
    rainPrediction,
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchWeather(lat = 30.90, lon = 75.85) {
  const delay = randomDelay();
  console.log("[Weather] Fetch started", { lat, lon, delay });
  await new Promise((resolve) => setTimeout(resolve, delay));

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const baseUrl = import.meta.env.VITE_OPENWEATHER_BASE_URL || "https://api.openweathermap.org";

  if (!apiKey) {
    console.log("[Weather] Missing VITE_OPENWEATHER_API_KEY, using mock fallback");
    const fallback = WEATHER_FALLBACKS[Math.floor(Math.random() * WEATHER_FALLBACKS.length)];
    return {
      ...fallback,
      description: `${fallback.description} (missing API key fallback)`,
      rainPrediction: {
        chance24h: fallback.precipitationChance,
        expectedRainMm24h: 0,
        likelyStartLocal: null,
        hourlyChances: [fallback.precipitationChance],
      },
      fetchedAt: new Date().toISOString(),
      isFallback: true,
    };
  }

  const currentUrl = `${baseUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const forecastUrl = `${baseUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl),
    ]);

    if (!currentResponse.ok) {
      throw new Error(`OpenWeather current HTTP ${currentResponse.status}`);
    }

    if (!forecastResponse.ok) {
      throw new Error(`OpenWeather forecast HTTP ${forecastResponse.status}`);
    }

    const [currentData, forecastData] = await Promise.all([
      currentResponse.json(),
      forecastResponse.json(),
    ]);

    const payload = toWeatherPayload(currentData, forecastData, lat, lon);
    console.log("[Weather] OpenWeather success", payload);
    return payload;
  } catch (error) {
    console.log("[Weather] OpenWeather failed, using mock fallback", { message: error.message });
    const fallback = WEATHER_FALLBACKS[Math.floor(Math.random() * WEATHER_FALLBACKS.length)];
    const payload = {
      ...fallback,
      description: `${fallback.description} (mock fallback)`,
      rainPrediction: {
        chance24h: fallback.precipitationChance,
        expectedRainMm24h: 0,
        likelyStartLocal: null,
        hourlyChances: [fallback.precipitationChance],
      },
      fetchedAt: new Date().toISOString(),
      isFallback: true,
    };
    console.log("[MockAPI] Weather fallback response", payload);
    return payload;
  }
}
