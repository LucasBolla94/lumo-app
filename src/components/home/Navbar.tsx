"use client";

import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[var(--color-dark-blue)] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">LumoClean</h1>

        {/* Menu para desktop */}
        <nav className="hidden md:flex gap-6">
          <a href="#home" className="hover:text-blue-300">Home</a>
          <a href="#services" className="hover:text-blue-300">Services</a>
          <a href="#about" className="hover:text-blue-300">About Us</a>
          <a href="#contact" className="hover:text-blue-300">Contact</a>
        </nav>

        {/* Botão Mobile */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <nav className="md:hidden bg-[var(--color-dark-blue)] flex flex-col gap-3 p-4">
          <a href="#home" className="text-white" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#services" className="text-white" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#about" className="text-white" onClick={() => setMenuOpen(false)}>About Us</a>
          <a href="#contact" className="text-white" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
      )}
    </header>
  );
}
