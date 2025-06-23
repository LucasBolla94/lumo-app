"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import LoginForm from "@/components/operations/LoginForm";

export default function OperationsLoginPage() {
  const router = useRouter();

  // Se o usuário já estiver logado, redireciona para /operations/dash/
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/operations/dash/");
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-blue-800 mb-6">
          Lumo Clean - Operator Login
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
