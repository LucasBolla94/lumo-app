export const SERVICE_PRICES: Record<string, number> = {
  "Sofa Cleaning": 40,
  "Carpet Cleaning": 40,
  "Residential Cleaner": 15,
  "Business Cleaner": 15,
};

export const TIME_SLOTS = Array.from({ length: 53 }, (_, i) => {
  const hour = 7 + Math.floor(i * 15 / 60);
  const minute = (i * 15) % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
});
