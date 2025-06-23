"use client";

import { useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { useTodayDate } from "../booking/useToday";
import { SERVICE_PRICES, TIME_SLOTS } from "@/utils/constants";
import Image from "next/image";

// Tipagem do formulário (sem campos derivados)
type BookingFormData = {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  hours: number;
  estimate: number;
  reference: string;
  preferredContact: string[];
};

export default function BookingForm() {
  const today = useTodayDate();

  const [form, setForm] = useState<Omit<BookingFormData, "estimate" | "reference">>({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    time: "",
    hours: 0,
    preferredContact: [],
  });

  const [estimate, setEstimate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Filtra horários inválidos para a data atual
  const filteredTimeSlots = useMemo(() => {
    if (!form.date || !today) return [];

    if (form.date !== today) return TIME_SLOTS;

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    return TIME_SLOTS.filter(slot => {
      const [h, m] = slot.split(":").map(Number);
      return h * 60 + m > nowMinutes;
    });
  }, [form.date, today]);

  // Atualização de estado e cálculo de estimativa
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "preferredContact") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({
        ...prev,
        preferredContact: checked
          ? [...prev.preferredContact, value]
          : prev.preferredContact.filter(v => v !== value),
      }));
    } else {
      const updatedValue = name === "hours" ? parseInt(value) : value;
      setForm(prev => ({ ...prev, [name]: updatedValue }));

      if (name === "service" || name === "hours") {
        const service = name === "service" ? value : form.service;
        const hours = name === "hours" ? parseInt(value) : form.hours;
        const rate = SERVICE_PRICES[service] || 0;
        setEstimate(rate * hours);
      }
    }
  };

  // Geração de referência única no formato L{DDMMYY}{4DIG}
  const generateReference = async (): Promise<string> => {
    const snapshot = await getDocs(collection(db, "bookings"));
    let ref: string;
    let exists = true;

    do {
      const date = new Date();
      const datePart = `${String(date.getDate()).padStart(2, "0")}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getFullYear()).slice(-2)}`;
      const random = Math.floor(1000 + Math.random() * 9000);
      ref = `L${datePart}${random}`;
      exists = snapshot.docs.some(doc => doc.data().reference === ref);
    } while (exists);

    return ref;
  };

  // Validações adicionais
  const validateForm = () => {
    if (!/^\d{7,15}$/.test(form.phone)) {
      alert("Please enter a valid phone number (digits only).");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      alert("Please enter a valid email address.");
      return false;
    }
    if (form.preferredContact.length === 0) {
      alert("Please select at least one preferred contact method.");
      return false;
    }
    return true;
  };

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Anti-flood
    if (!validateForm()) return;

    setLoading(true);
    try {
      const reference = await generateReference();
      await addDoc(collection(db, "bookings"), {
        ...form,
        estimate,
        reference,
        createdAt: serverTimestamp(),
      });

      setSubmittedRef(reference);
      setForm({
        name: "",
        lastName: "",
        phone: "",
        email: "",
        service: "",
        date: "",
        time: "",
        hours: 0,
        preferredContact: [],
      });
      setEstimate(0);
    } catch (error) {
      console.error(error);
      alert("Failed to book!");
    } finally {
      setLoading(false);
    }
  };

  if (!today) return null;

  return (
    <section id="booking" className="bg-[var(--color-dark-blue)] text-white py-20 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-10">
        <h2 className="text-3xl font-bold text-center text-[var(--color-dark-blue)] mb-4">
          Book a Cleaning
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          This form reserves your spot. The price is an estimate and may vary depending on the service and property assessment.
          A Lumo Clean team member will contact you via your preferred method to confirm.
        </p>

        {/* FORMULÁRIO PRINCIPAL */}
        <form onSubmit={handleSubmit} className="grid gap-4 text-black">
          {/* Nome e Sobrenome */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" placeholder="First Name" value={form.name} onChange={handleChange} required className="p-3 border border-gray-300 rounded" />
            <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required className="p-3 border border-gray-300 rounded" />
          </div>

          {/* Telefone e Email */}
          <input type="tel" name="phone" placeholder="Phone Number" inputMode="numeric" value={form.phone} onChange={handleChange} required className="p-3 border border-gray-300 rounded" />
          <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required className="p-3 border border-gray-300 rounded" />

          {/* Serviço */}
          <select name="service" value={form.service} onChange={handleChange} required className="p-3 border border-gray-300 rounded bg-white">
            <option value="">Select Service</option>
            {Object.keys(SERVICE_PRICES).map(s => <option key={s}>{s}</option>)}
          </select>

          {/* Data e Hora */}
          <input type="date" name="date" value={form.date} onChange={handleChange} min={today} required className="p-3 border border-gray-300 rounded" />
          <select name="time" value={form.time} onChange={handleChange} required className="p-3 border border-gray-300 rounded bg-white">
            <option value="">Select Time</option>
            {filteredTimeSlots.map(t => <option key={t}>{t}</option>)}
          </select>

          {/* Duração */}
          <select name="hours" value={form.hours} onChange={handleChange} required className="p-3 border border-gray-300 rounded bg-white">
            <option value={0}>Select Hours</option>
            {Array.from({ length: 8 }, (_, i) => i + 1).map(h => (
              <option key={h} value={h} disabled={form.service.includes("Cleaner") && h < 2}>
                {h} hour{h > 1 && "s"}
              </option>
            ))}
          </select>

          {/* Contato preferido */}
          <fieldset className="border border-gray-300 rounded p-4">
            <legend className="text-sm font-semibold text-gray-600 mb-2">Preferred Contact Method</legend>
            {["Email", "WhatsApp", "Phone Call"].map(method => (
              <label key={method} className="block">
                <input type="checkbox" name="preferredContact" value={method} checked={form.preferredContact.includes(method)} onChange={handleChange} className="mr-2" />
                {method}
              </label>
            ))}
          </fieldset>

          {/* Estimativa */}
          <div className="bg-yellow-100 p-4 rounded text-center text-sm text-yellow-800 border border-yellow-300">
            <strong>Estimated Total: £{estimate}</strong><br />
            This price is only an estimate and will be confirmed after discussion.
          </div>

          <button type="submit" disabled={loading} className="bg-[var(--color-light-blue)] text-white p-3 rounded font-semibold hover:bg-blue-700 transition">
            {loading ? "Submitting..." : "Submit Booking"}
          </button>
        </form>

        {/* CONFIRMAÇÃO */}
        {submittedRef && (
          <div className="mt-6 bg-green-100 border border-green-300 p-4 rounded text-center text-green-800 flex flex-col items-center">
            <Image src="/WhatsApp.webp" alt="WhatsApp" width={50} height={50} className="mb-3" />
            <p className="mb-2 font-medium">Booking confirmed! Click below to contact us directly via WhatsApp:</p>
            <a
              href={`https://wa.me/447432009032?text=Hi! My booking reference is ${submittedRef}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
            >
              Chat on WhatsApp
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
