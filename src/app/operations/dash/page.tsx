"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function OperationsDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/operations"); // redireciona se não logado
      } else {
        setUserEmail(user.email);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/operations");
  };

  if (loading) return <p className="p-6 text-center text-gray-600">Loading...</p>;

  return (
    <main className="min-h-screen bg-white px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">Lumo Clean - Dashboard</h1>
        <p className="text-gray-700 mb-6">Welcome, <span className="font-semibold">{userEmail}</span></p>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>

        {/* Aqui você pode adicionar cards, botões, etc */}
        <div className="mt-8">
          <p className="text-gray-500">Dashboard content goes here...</p>
        </div>
      </div>
    </main>
  );
}
