// src/components/Tracker.tsx
"use client";
import { useEffect } from "react";

export default function Tracker() {
  useEffect(() => {
    // Har page load/interact par user ki activity update hogi
    fetch('/api/update-activity', { method: 'POST' });
  }, []);
  return null;
} 






