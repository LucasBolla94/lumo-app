"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export function useTodayDate() {
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(format(new Date(), "yyyy-MM-dd"));
  }, []);

  return today;
}
