"use client";

const services = [
  {
    title: "Residential Cleaning",
    description: "High-quality regular and deep cleaning for your home.",
  },
  {
    title: "Commercial Cleaning",
    description: "Keep your office or store clean and sanitized.",
  },
  {
    title: "Sofa & Upholstery Cleaning",
    description: "We clean and sanitize sofas, chairs and mattresses.",
  },
  {
    title: "Carpet Cleaning",
    description: "Deep carpet cleaning for freshness and hygiene.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-[var(--background)] text-[var(--foreground)] py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-[var(--color-light-blue)] text-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
