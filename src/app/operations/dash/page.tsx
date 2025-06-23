"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import BookingList from "@/components/dash/BookingList";
import BookingDetails from "@/components/dash/BookingDetails";
import type { BookingFormData } from "@/types/booking";

export default function DashboardPage() {
  const router = useRouter();

  // 🔧 Armazena os bookings e estado selecionado
  const [bookings, setBookings] = useState<(BookingFormData & { id: string })[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingFormData & { id: string } | null>(null);

  // 🔍 Campo de busca (por telefone, email ou referência)
  const [search, setSearch] = useState("");

  // ⏳ Estados de carregamento e autenticação
  const [loading, setLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // 🔐 Verifica se o usuário está autenticado
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/operations"); // 🔁 Redireciona se não autenticado
      } else {
        setIsAuthChecked(true);
      }
    });

    return () => unsub();
  }, [router]);

  // 🔄 Carrega os dados do Firestore após autenticação
  useEffect(() => {
    if (!isAuthChecked) return;

    const fetchBookings = async () => {
      try {
        const snap = await getDocs(collection(db, "bookings"));

        const data = snap.docs.map((doc) => {
          const booking = doc.data() as BookingFormData;
          return {
            ...booking,
            id: doc.id, // ✅ Coloca o ID por último para não ser sobrescrito
          };
        });

        setBookings(data);
        setLoading(false);

        console.log("✅ Bookings carregados:", data); // Debug opcional
      } catch (error) {
        console.error("❌ Erro ao buscar bookings:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthChecked]);

  // 🔎 Filtragem baseada em referência, telefone ou email
  const filtered = bookings.filter((b) =>
    b.reference?.toLowerCase().includes(search.toLowerCase()) ||
    b.phone?.toLowerCase().includes(search.toLowerCase()) ||
    b.email?.toLowerCase().includes(search.toLowerCase())
  );

  // ⏳ Enquanto carrega
  if (!isAuthChecked || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">Bookings Panel</h1>

        {selectedBooking ? (
          <BookingDetails
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        ) : (
          <>
            <input
              type="text"
              placeholder="Search by reference, phone or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <BookingList bookings={filtered} onSelect={setSelectedBooking} />
          </>
        )}
      </div>
    </main>
  );
}
