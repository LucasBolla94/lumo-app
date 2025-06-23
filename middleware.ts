import { NextRequest, NextResponse } from "next/server";

// Define quais rotas precisam de autenticação
const protectedRoutes = ["/operations/dash"];

export function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  // Se a rota não for protegida, continua normalmente
  if (!protectedRoutes.includes(currentPath)) {
    return NextResponse.next();
  }

  // Verifica cookie do Firebase
  const token = request.cookies.get("__session") || request.cookies.get("token");

  // Se não estiver autenticado, redireciona para /operations (login)
  if (!token) {
    return NextResponse.redirect(new URL("/operations", request.url));
  }

  // Continua se estiver logado
  return NextResponse.next();
}

// Middleware será executado nessas rotas:
export const config = {
  matcher: ["/operations/dash"],
};
