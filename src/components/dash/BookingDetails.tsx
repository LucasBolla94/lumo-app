"use client";

import { useState, useEffect, useMemo } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { BookingFormData } from "@/types/booking";
import Image from "next/image";

type Props = {
  booking: BookingFormData;
  onClose: () => void;
};

export default function BookingDetails({ booking, onClose }: Props) {
  const {
    id,
    reference,
    name,
    lastName,
    email,
    phone,
    service,
    date,
    time,
    hours,
    estimate,
    preferredContact,
    address,
    number,
    postcode,
    notes = "",
    confirmed = null,
    cancel = false,
  } = booking;

  const [noteInput, setNoteInput] = useState(notes);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(confirmed);
  const [isCancelled, setIsCancelled] = useState(cancel);

  useEffect(() => {
    setNoteInput(notes);
  }, [notes]);

  const bookingRef = useMemo(() => {
    if (!id) {
      console.error("❌ booking.id está undefined!");
      return null;
    }
    return doc(db, "bookings", id);
  }, [id]);

  const handleSaveNote = async () => {
    if (!bookingRef) return alert("Booking ID not found.");
    setIsSavingNote(true);
    try {
      await updateDoc(bookingRef, { notes: noteInput });
    } catch (err) {
      console.error("❌ Error saving note:", err);
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleConfirmChange = async (value: boolean) => {
    if (!bookingRef) return alert("Booking ID not found.");
    try {
      await updateDoc(bookingRef, { confirmed: value });
      setIsConfirmed(value);
    } catch (err) {
      console.error("❌ Error updating confirmation:", err);
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingRef) return alert("Booking ID not found.");
    try {
      await updateDoc(bookingRef, { cancel: true });
      setIsCancelled(true);
    } catch (err) {
      console.error("❌ Error cancelling booking:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md border border-gray-200 text-sm text-gray-800 space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-blue-800">Booking Details</h2>

      {/* INFO DO CLIENTE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p><strong>Reference:</strong> {reference}</p>
          <p><strong>Name:</strong> {name} {lastName}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Phone:</strong> {phone}</p>
          <p><strong>Preferred Contact:</strong> {preferredContact?.join(", ")}</p>
          <p><strong>Status:</strong>{" "}
            {isCancelled ? (
              <span className="text-red-600 font-semibold">Cancelled</span>
            ) : isConfirmed === true ? (
              <span className="text-green-600 font-semibold">Confirmed</span>
            ) : isConfirmed === false ? (
              <span className="text-yellow-600 font-semibold">Not Confirmed</span>
            ) : (
              <span className="text-gray-500 italic">Pending</span>
            )}
          </p>
        </div>

        <div className="space-y-1">
          <p><strong>Service:</strong> {service}</p>
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Time:</strong> {time}</p>
          <p><strong>Hours:</strong> {hours}h</p>
          <p><strong>Estimate:</strong> £{estimate.toFixed(2)}</p>
        </div>
      </div>

      {/* ENDEREÇO */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-3 sm:p-4">
        <h3 className="font-semibold text-gray-700 mb-1">Client Address</h3>
        <p>{address}, Nº {number}</p>
        <p>{postcode}</p>
      </div>

      {/* AÇÕES */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <a
          href={`https://wa.me/44${phone.replace(/^0/, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
        >
          <Image
            src="/WhatsApp.webp"
            alt="WhatsApp"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          Contact via WhatsApp
        </a>

        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Confirmed:</span>
          <button
            onClick={() => handleConfirmChange(true)}
            className={`px-3 py-1 rounded-md text-white text-sm ${
              isConfirmed === true ? "bg-green-600" : "bg-gray-400"
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => handleConfirmChange(false)}
            className={`px-3 py-1 rounded-md text-white text-sm ${
              isConfirmed === false ? "bg-red-600" : "bg-gray-400"
            }`}
          >
            No
          </button>
        </div>
      </div>

      {/* NOTAS */}
      <div>
        <label htmlFor="notes" className="block font-medium text-gray-700 mb-1">
          Internal Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="Enter notes here..."
        />
        <button
          onClick={handleSaveNote}
          disabled={isSavingNote}
          className={`mt-2 px-4 py-2 text-white rounded-md text-sm ${
            isSavingNote ? "bg-blue-300 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"
          }`}
        >
          {isSavingNote ? "Saving..." : "Save Note"}
        </button>
      </div>

      {/* CANCELAR */}
      {!isCancelled && (
        <div>
          <button
            onClick={handleCancelBooking}
            className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
          >
            Cancel Booking
          </button>
        </div>
      )}

      {/* VOLTAR */}
      <div>
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md text-sm"
        >
          Back
        </button>
      </div>
    </div>
  );
}
