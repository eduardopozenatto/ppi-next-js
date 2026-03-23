import { type NextRequest, NextResponse } from "next/server";

/** Mantém pedidos sem redirecionamento forçado (auth é tratada na app). */
export function proxy(request: NextRequest) {
  void request;
  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
