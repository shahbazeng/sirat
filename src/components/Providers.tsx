"use client";
import React from "react";
// import { SessionProvider } from "next-auth/react"; // Temporary comment out

export function Providers({ children }: { children: React.ReactNode }) {
  // Direct children return karein bina kisi provider dynamic lifecycle ke
  return <>{children}</>;
}