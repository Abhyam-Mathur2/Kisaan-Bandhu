const CLIMATE_RISK_ITEMS = [
  {
    riskLevel: "Low",
    score: 24,
    summary: "Stable next 72 hours with low precipitation risk.",
    recommendations: ["Continue normal irrigation", "Monitor soil moisture every 2 days"],
  },
  {
    riskLevel: "Moderate",
    score: 52,
    summary: "Potential wind surge and humidity spike expected tomorrow.",
    recommendations: ["Secure lightweight crop covers", "Delay foliar spray by 24 hours"],
  },
  {
    riskLevel: "High",
    score: 78,
    summary: "Intense rainfall probability detected in the coming 48 hours.",
    recommendations: ["Clear drainage channels", "Avoid fertilizer application today"],
  },
];

function randomDelay() {
  return 800 + Math.floor(Math.random() * 700);
}

export async function fetchClimateRiskAssessment() {
  const delay = randomDelay();
  console.log("[MockAPI] Climate risk request started", { delay });
  await new Promise((resolve) => setTimeout(resolve, delay));

  const item = CLIMATE_RISK_ITEMS[Math.floor(Math.random() * CLIMATE_RISK_ITEMS.length)];
  const response = {
    ...item,
    fetchedAt: new Date().toISOString(),
  };

  console.log("[MockAPI] Climate risk response", response);
  return response;
}
