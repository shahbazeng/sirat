"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Mail, ShieldCheck, ArrowLeft, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#fdfcf8] p-6 flex flex-col items-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mt-10">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-black transition">
          <ArrowLeft size={18} /> Wapis
        </button>

        <h1 className="text-2xl font-black italic mb-8 text-sirat-dark">User <span className="text-sirat-gold">Profile</span></h1>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <User className="text-sirat-gold" />
            <div>
              <p className="text-[10px] uppercase font-bold opacity-40">Naam</p>
              <p className="font-bold">{session.user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <Mail className="text-sirat-gold" />
            <div>
              <p className="text-[10px] uppercase font-bold opacity-40">Email</p>
              <p className="font-bold">{session.user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <ShieldCheck className="text-sirat-gold" />
            <div>
              <p className="text-[10px] uppercase font-bold opacity-40">Status</p>
              <p className="font-bold text-green-600">Verified Account</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full mt-10 bg-red-50 text-red-600 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
}