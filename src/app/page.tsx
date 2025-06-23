"use client";

import Navbar from "@/components/home/Navbar";
import HomeSection from "@/components/home/HomeSection";
import Services from "@/components/home/Services";
import AboutUs from "@/components/home/AboutUs";
import Contact from "@/components/home/Contact";
import BookingForm from "@/components/home/BookingForm";

export default function HomePage() {
  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <Navbar />
      <HomeSection />
      <Services />
      <AboutUs />
      <Contact />
      <BookingForm />
    </main>
  );
}
