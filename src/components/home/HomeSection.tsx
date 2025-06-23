"use client";

export default function HomeSection() {
  return (
    <section id="home" className="bg-[var(--color-light-blue)] text-white py-16 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Welcome to Lumo Clean</h2>
        <p className="text-lg md:text-xl mb-6">
          Professional cleaning services for homes, offices, sofas and carpets in Glasgow.
        </p>
        <a
          href="#contact"
          className="inline-block bg-white text-[var(--color-dark-blue)] font-semibold py-3 px-6 rounded hover:bg-blue-100 transition"
        >
          Book a Cleaning Now
        </a>
      </div>
    </section>
  );
}
