"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // NextAuth ka signIn function
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // Hum khud redirect karenge agar success hua
    });

    if (res?.ok) {
      alert("Login Kamyab!");
      router.push("/chat"); // Login ke baad seedha Chat page par
      router.refresh();
    } else {
      alert("Ghalat Email ya Password!");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-2xl w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 italic">Sirat AI - Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Apna Email" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none" 
            onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none" 
            onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading} className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition-all disabled:bg-gray-400">
            {loading ? "Chकिंग..." : "Login Karein"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Account nahi hai? <a href="/register" className="text-blue-600 hover:underline">Register yahan se karein</a>
        </p>
      </div>
    </div>
  );
} 





