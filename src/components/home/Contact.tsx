"use client";

export default function Contact() {
  return (
    <section id="contact" className="bg-[var(--background)] text-[var(--foreground)] py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
        <p className="mb-6 text-lg">
          Want to book a cleaning or have any questions? Contact us and we’ll get back to you as soon as possible.
        </p>

        <a
          href="mailto:contact@lumoclean.co.uk"
          className="inline-block bg-[var(--color-dark-blue)] text-white font-medium py-3 px-6 rounded hover:bg-blue-800 transition"
        >
          Email Us
        </a>
      </div>
    </section>
  );
}
