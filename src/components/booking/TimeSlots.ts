// Gera horários de 07:00 até 20:00 com intervalos de 15min
export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let min = 7 * 60; min <= 20 * 60; min += 15) {
    const h = String(Math.floor(min / 60)).padStart(2, "0");
    const m = String(min % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
  }
  return slots;
};
