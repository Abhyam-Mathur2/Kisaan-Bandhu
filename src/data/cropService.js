const CROP_RECOMMENDATIONS = [
  {
    crop: "Wheat",
    confidence: 0.91,
    rationale: "Current soil moisture and temperature profile favor wheat germination.",
    actions: ["Sow within 5 days", "Use nitrogen-rich base mix", "Irrigate lightly after seeding"],
  },
  {
    crop: "Mustard",
    confidence: 0.83,
    rationale: "Low rain probability and cool nights match mustard growth conditions.",
    actions: ["Prepare fine seedbed", "Maintain row spacing 30cm", "Monitor aphids weekly"],
  },
  {
    crop: "Chickpea",
    confidence: 0.87,
    rationale: "Medium humidity and moderate daytime heat are suitable for chickpea.",
    actions: ["Use treated seeds", "Avoid over-irrigation", "Add phosphorus during sowing"],
  },
];

function randomDelay() {
  return 800 + Math.floor(Math.random() * 700);
}

export async function fetchCropRecommendation() {
  const delay = randomDelay();
  console.log("[MockAPI] Crop recommendation request started", { delay });
  await new Promise((resolve) => setTimeout(resolve, delay));

  const item = CROP_RECOMMENDATIONS[Math.floor(Math.random() * CROP_RECOMMENDATIONS.length)];
  const response = {
    ...item,
    fetchedAt: new Date().toISOString(),
  };

  console.log("[MockAPI] Crop recommendation response", response);
  return response;
}
