"use client";

import { useState, useMemo } from "react";
import type { BookingFormData } from "@/types/booking";

type Props = {
  bookings: BookingFormData[];
  onSelect: (booking: BookingFormData) => void;
};

export default function BookingList({ bookings, onSelect }: Props) {
  const [visibleCount, setVisibleCount] = useState(10);

  // 🔁 Ordenar por data e hora mais próxima
  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`);
      const dateTimeB = new Date(`${b.date}T${b.time}`);
      return dateTimeA.getTime() - dateTimeB.getTime();
    });
  }, [bookings]);

  const visibleBookings = sortedBookings.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  if (bookings.length === 0) {
    return <p className="text-gray-500 text-sm">No bookings found.</p>;
  }

  return (
    <div>
      <ul className="space-y-2">
        {visibleBookings.map((b) => {
          const status = b.cancel
            ? { label: "Cancelled", color: "text-red-600" }
            : b.confirmed === true
            ? { label: "Confirmed", color: "text-green-600" }
            : b.confirmed === false
            ? { label: "Not Confirmed", color: "text-yellow-600" }
            : { label: "Pending", color: "text-gray-500" };

          return (
            <li
              key={b.reference}
              onClick={() => onSelect(b)}
              className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-blue-50 transition"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-blue-800 font-semibold text-sm">{b.reference}</h3>
                <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
              </div>
              <p className="text-sm text-gray-700">
                {b.name} {b.lastName} &bull; {b.service}
              </p>
              <p className="text-xs text-gray-500">{b.date} at {b.time}</p>
            </li>
          );
        })}
      </ul>

      {visibleCount < bookings.length && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-sm font-medium transition"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
