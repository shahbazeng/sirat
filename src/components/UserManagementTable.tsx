"use client";
import React from 'react';
import { Trash2, ShieldCheck, Download, UserCircle, Loader2 } from 'lucide-react';

export default function UserManagementTable({ users }: { users: any[] }) {
  if (!users) return <div className="p-20 text-center flex justify-center"><Loader2 className="animate-spin text-[#D4AF37]" size={32}/></div>;

  const toggleRole = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      });
      if(res.ok) window.location.reload();
    } catch (e) { console.error("Role update failed"); }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' });
    window.location.reload();
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-black text-2xl tracking-tight">User Registry ({users.length})</h3>
        <button className="flex items-center gap-2 bg-[#1a2e2a] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-black transition-all">
          <Download size={18} /> Export
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 text-[10px] uppercase tracking-[0.2em] border-b">
              <th className="pb-4">User Details</th>
              <th className="pb-4">Email Address</th>
              <th className="pb-4">Access Level</th>
              <th className="pb-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                <td className="py-6 flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-full text-gray-500"><UserCircle size={20} /></div>
                  <span className="font-bold text-sm">{user.name || "Anonymous"}</span>
                </td>
                <td className="py-6 text-sm text-gray-500">{user.email}</td>
                <td className="py-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    user.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.role || 'USER'}
                  </span>
                </td>
                <td className="py-6 text-right flex justify-end gap-3">
                  <button onClick={() => toggleRole(user.id, user.role)} className="p-2 hover:bg-amber-50 rounded-lg text-gray-400 hover:text-amber-600"><ShieldCheck size={18} /></button>
                  <button onClick={() => deleteUser(user.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}