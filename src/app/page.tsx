"use client";

import React, { useState, useEffect } from "react";
import { ParticipantTable } from "@/components/participants/ParticipantTable";
import { supabase } from "@/lib/supabase";
import {
  BarChart2,
  Users,
  Settings,
  LogOut,
  FileBadge,
  ClipboardList,
  TrendingUp,
  Clock,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

type Stats = {
  total: number;
  peserta: number;
  panitia: number;
};

function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ total: 0, peserta: 0, panitia: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase.from("attendance").select("peran");
      if (data) {
        setStats({
          total: data.length,
          peserta: data.filter((d) => d.peran?.toLowerCase() === "peserta").length,
          panitia: data.filter((d) => d.peran?.toLowerCase() === "panitia").length,
        });
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Absensi",
      value: loading ? "..." : stats.total.toString(),
      sub: "Total peserta tercatat",
      icon: Users,
      color: "bg-indigo-500",
      ring: "ring-indigo-100",
    },
    {
      label: "Peserta",
      value: loading ? "..." : stats.peserta.toString(),
      sub: "Peran: Peserta",
      icon: ClipboardList,
      color: "bg-amber-500",
      ring: "ring-amber-100",
    },
    {
      label: "Panitia",
      value: loading ? "..." : stats.panitia.toString(),
      sub: "Peran: Panitia",
      icon: FileBadge,
      color: "bg-emerald-500",
      ring: "ring-emerald-100",
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <p className="text-xs font-bold text-indigo-600 tracking-widest uppercase mb-1">Overview</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 mb-1">Dashboard</h2>
        <p className="text-sm text-slate-500">Ringkasan data absensi dari sistem.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex justify-between items-end"
            >
              <div className="space-y-4">
                <div className={`w-10 h-10 rounded-xl ${card.color} text-white flex items-center justify-center shadow-sm ring-4 ${card.ring}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">{card.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                </div>
              </div>
              <div className="text-[11px] font-medium text-slate-400 pb-1">{card.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Info */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <p className="font-semibold text-sm text-slate-800 mb-1">Cara menggunakan</p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Buka tab <span className="font-medium text-indigo-600">Attendance</span> untuk melihat, menambah, mengedit, dan menghapus data peserta dari database Supabase.
            Kamu juga bisa mencetak sertifikat kehadiran langsung dari tabel.
          </p>
        </div>
      </div>
    </div>
  );
}

function AttendancePage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-xs font-bold text-indigo-600 tracking-widest uppercase mb-1">Database</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 mb-1">Data Absensi</h2>
        <p className="text-sm text-slate-500">
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <ParticipantTable />
      </div>
    </div>
  );
}

function SettingsPage() {
  const getStored = (key: string, fallback: string) => {
    if (typeof window === "undefined") return fallback;
    return localStorage.getItem(key) || fallback;
  };

  const [username, setUsername] = useState(() =>
    getStored("admin_username", process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin")
  );
  const [password, setPassword] = useState(() =>
    getStored("admin_password", process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123")
  );

  // Username form
  const [newUsername, setNewUsername] = useState("");
  const [confirmCurrentForUser, setConfirmCurrentForUser] = useState("");

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Show/hide password toggles
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChangeUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmCurrentForUser !== password) {
      showToast("error", "Password konfirmasi salah.");
      return;
    }
    if (!newUsername.trim()) {
      showToast("error", "Username baru tidak boleh kosong.");
      return;
    }
    localStorage.setItem("admin_username", newUsername.trim());
    setUsername(newUsername.trim());
    setNewUsername("");
    setConfirmCurrentForUser("");
    showToast("success", "Username berhasil diperbarui!");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPassword !== password) {
      showToast("error", "Password saat ini salah.");
      return;
    }
    if (newPassword.length < 6) {
      showToast("error", "Password baru minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast("error", "Konfirmasi password tidak cocok.");
      return;
    }
    localStorage.setItem("admin_password", newPassword);
    setPassword(newPassword);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    showToast("success", "Password berhasil diperbarui!");
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white text-slate-800 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5";

  return (
    <div className="max-w-[700px] mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">Configuration</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 mb-1">Settings</h2>
        <p className="text-sm text-slate-500">Kelola kredensial akun admin dashboard.</p>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium shadow-md border animate-in fade-in slide-in-from-top-2 duration-200 ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.msg}
        </div>
      )}

      {/* Current Credentials Info Card */}
      <div className="bg-[#1a1c23] rounded-2xl p-5 flex items-center gap-4 shadow-md">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow">
          {username.substring(0, 1).toUpperCase()}
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium mb-0.5">Akun Admin Saat Ini</p>
          <p className="text-white font-semibold text-sm">{username}</p>
          <p className="text-slate-400 text-xs mt-0.5">{"●".repeat(Math.min(password.length, 12))} ({password.length} karakter)</p>
        </div>
        <div className="ml-auto text-[10px] font-medium bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/30">
          Active
        </div>
      </div>

      {/* Change Username */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900">Ganti Username</h3>
            <p className="text-[11px] text-slate-400">Masukkan password saat ini untuk konfirmasi</p>
          </div>
        </div>
        <form onSubmit={handleChangeUsername} className="p-6 space-y-4">
          <div>
            <label className={labelClass}>Username Baru</label>
            <input
              type="text"
              required
              placeholder="Masukkan username baru"
              className={inputClass}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Konfirmasi dengan Password Saat Ini</label>
            <div className="relative">
              <input
                type={showCurrentPw ? "text" : "password"}
                required
                placeholder="Masukkan password saat ini"
                className={inputClass + " pr-10"}
                value={confirmCurrentForUser}
                onChange={(e) => setConfirmCurrentForUser(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                {showCurrentPw ? "Sembunyikan" : "Lihat"}
              </button>
            </div>
          </div>
          <div className="pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Simpan Username
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <Settings className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900">Ganti Password</h3>
            <p className="text-[11px] text-slate-400">Minimal 6 karakter</p>
          </div>
        </div>
        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
          <div>
            <label className={labelClass}>Password Saat Ini</label>
            <div className="relative">
              <input
                type={showCurrentPw ? "text" : "password"}
                required
                placeholder="Masukkan password saat ini"
                className={inputClass + " pr-10"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                {showCurrentPw ? "Sembunyikan" : "Lihat"}
              </button>
            </div>
          </div>
          <div>
            <label className={labelClass}>Password Baru</label>
            <div className="relative">
              <input
                type={showNewPw ? "text" : "password"}
                required
                placeholder="Minimal 6 karakter"
                className={inputClass + " pr-10"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNewPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                {showNewPw ? "Sembunyikan" : "Lihat"}
              </button>
            </div>
          </div>
          <div>
            <label className={labelClass}>Konfirmasi Password Baru</label>
            <div className="relative">
              <input
                type={showConfirmPw ? "text" : "password"}
                required
                placeholder="Ulangi password baru"
                className={inputClass + " pr-10"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                {showConfirmPw ? "Sembunyikan" : "Lihat"}
              </button>
            </div>
          </div>
          {/* Password strength indicator */}
          {newPassword.length > 0 && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      newPassword.length >= n * 3
                        ? n <= 1 ? "bg-red-400" : n <= 2 ? "bg-amber-400" : n <= 3 ? "bg-blue-400" : "bg-emerald-500"
                        : "bg-slate-100"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                {newPassword.length < 6 ? "Terlalu pendek" : newPassword.length < 9 ? "Lemah" : newPassword.length < 12 ? "Cukup kuat" : "Kuat ✓"}
              </p>
            </div>
          )}
          <div className="pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Simpan Password
            </button>
          </div>
        </form>
      </div>

      {/* Info: Storage explanation */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-[12px] text-slate-500 space-y-1 leading-relaxed">
        <p className="font-semibold text-slate-700 mb-1">ℹ️ Cara kerja penyimpanan kredensial</p>
        <p>• <span className="font-medium text-slate-600">Default awal</span>: diambil dari file <code className="bg-slate-100 px-1 rounded text-[11px]">.env.local</code> (ubah <code className="bg-slate-100 px-1 rounded text-[11px]">NEXT_PUBLIC_ADMIN_USERNAME</code> & <code className="bg-slate-100 px-1 rounded text-[11px]">NEXT_PUBLIC_ADMIN_PASSWORD</code>).</p>
        <p>• <span className="font-medium text-slate-600">Setelah diubah di sini</span>: tersimpan di <code className="bg-slate-100 px-1 rounded text-[11px]">localStorage</code> browser dan mengoverride nilai dari env.</p>
        <p>• Mengganti browser atau mode incognito akan kembali ke nilai default dari <code className="bg-slate-100 px-1 rounded text-[11px]">.env.local</code>.</p>
      </div>
    </div>
  );
}


// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: (user: User) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      setError("Email atau password salah. Coba lagi.");
      setLoading(false);
      return;
    }

    onLogin(data.user);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4 font-sans antialiased">
      {/* Background grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow blobs */}
      <div className="fixed top-1/4 left-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/3 w-80 h-80 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg tracking-wider shadow-2xl shadow-indigo-500/30 mb-4">
            D64
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Console</h1>
          <p className="text-sm text-slate-400 mt-1">Sistem Absensi Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-[#1a1c23] border border-[#2a2d36] rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Masuk sebagai Admin</span>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 flex items-center gap-2">
              <span className="shrink-0">✕</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@example.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#0f1117] border border-[#2a2d36] rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-9 pr-11 py-2.5 bg-[#0f1117] border border-[#2a2d36] rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Masuk...
                </>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-600 mt-6">
          Hanya untuk administrator sistem. &copy; {new Date().getFullYear()} DIES 64 UNUD.
        </p>
      </div>
    </div>
  );
}

// ─── Main Shell ───────────────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart2 },
  { id: "Attendance", label: "Attendance", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Attendance");

  // Check existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm animate-pulse">
            D64
          </div>
          <p className="text-slate-500 text-sm">Memuat session...</p>
        </div>
      </div>
    );
  }

  // Not logged in → show login page
  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  // Logged in → show dashboard
  const userEmail = user.email || "admin";
  const userInitials = userEmail.substring(0, 2).toUpperCase();

  const breadcrumb: Record<string, string> = {
    dashboard: "Dashboard",
    Attendance: "Data Absensi",
    settings: "Settings",
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 flex font-sans antialiased">
      {/* Sidebar Navigation (Dark Theme) */}
      <aside className="w-[260px] bg-[#1a1c23] border-r border-[#2a2d36] flex flex-col justify-between shrink-0 sticky top-0 h-screen text-slate-300">
        <div className="space-y-6 pt-6">
          {/* Logo / Brand Header */}
          <div className="flex items-center gap-3 px-6 pb-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-[11px] tracking-wider shadow-md">
              D64
            </div>
            <div>
              <h1 className="font-semibold text-sm text-white tracking-tight">Attendance</h1>
              <p className="text-[11px] text-slate-400">Admin Console</p>
            </div>
          </div>

          {/* Nav Items */}
          <div className="px-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-3">
              Workspace
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#252831] text-white border border-[#313540] shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-[#20222a]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                    <span>{item.label}</span>
                    {item.id === "Attendance" && (
                      <span className="ml-auto text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-md font-semibold">
                        Live
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Profile / Logout */}
        <button
          onClick={handleLogout}
          className="p-4 border-t border-[#2a2d36] m-4 rounded-xl hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-colors cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
              {userInitials}
            </div>
            <div className="min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">{userEmail}</p>
              <p className="text-[11px] text-slate-400 truncate">Administrator</p>
            </div>
          </div>
          <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-400 shrink-0 transition-colors" />
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 flex justify-between items-center bg-white px-8 border-b border-slate-200 shrink-0 sticky top-0 z-10">
          <div className="flex items-center text-xs font-medium text-slate-400">
            <span>Admin Console</span>
            <span className="mx-2 text-slate-300">›</span>
            <span className="text-slate-700 font-semibold">{breadcrumb[activeTab]}</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">Supabase Connected</span>
            </div>
            <Clock className="w-4 h-4 text-slate-300" />
            <span>Live sync</span>
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {userInitials}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === "dashboard" && <DashboardPage />}
          {activeTab === "Attendance" && <AttendancePage />}
          {activeTab === "settings" && <SettingsPage />}
        </div>
      </main>
    </div>
  );
}
