"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        alert("Account ban gaya! Ab login karein.");
        router.push("/login");
      } else {
        const data = await res.json();
        alert(data.error || "Kuch ghalat hua!");
      }
    } catch (err) {
      alert("Network ka masla hai!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Sirat AI - Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Naam" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
            onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
            onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
            onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading} className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition-all disabled:bg-gray-400">
            {loading ? "Processing..." : "Register Karein"}
          </button>
        </form>
      </div>
    </div>
  );
}