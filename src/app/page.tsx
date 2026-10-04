"use client";

import React, { useState } from "react";
import { ParticipantTable } from "@/components/participants/ParticipantTable";
import {
  BarChart2,
  Users,
  Calendar,
  Settings,
  LogOut,
  Plus,
  FileBadge
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("participants");

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 flex font-sans antialiased">
      {/* Sidebar Navigation (Dark Theme) */}
      <aside className="w-[260px] bg-[#1a1c23] border-r border-[#2a2d36] flex flex-col justify-between shrink-0 sticky top-0 h-screen text-slate-300">
        <div className="space-y-6 pt-6">
          {/* Logo / Brand Header */}
          <div className="flex items-center gap-3 px-6 pb-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-[11px] tracking-wider">
              D64
            </div>
            <div>
              <h1 className="font-semibold text-sm text-white tracking-tight">Attendance</h1>
              <p className="text-[11px] text-slate-400">Admin Console</p>
            </div>
          </div>

          {/* Nav Items */}
          <div className="px-4">
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-3">
              Workspace
            </h2>
            <nav className="space-y-1">
              {[
                { id: "dashboard", label: "Dashboard", icon: BarChart2 },
                { id: "participants", label: "Participants", icon: Users },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                      ? "bg-[#252831] text-white border border-[#313540] shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#20222a]"
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Profile / Status Bottom Bar */}
        <div className="p-4 border-t border-[#2a2d36] m-4 rounded-xl hover:bg-[#20222a] transition-colors cursor-pointer flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700 shrink-0">
              AR
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">Andi Rahman</p>
              <p className="text-[11px] text-slate-400 truncate">Administrator</p>
            </div>
          </div>
          <LogOut className="w-4 h-4 text-slate-500 hover:text-slate-300" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 flex justify-between items-center bg-white px-8 border-b border-slate-200 shrink-0 sticky top-0 z-10">
          <div className="flex items-center text-xs font-medium text-slate-400">
            <span>Admin Console</span>
            <span className="mx-2">•</span>
            <span className="text-slate-700">Participant Management</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <span>Last synced 2 min ago</span>
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              AR
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1200px] mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs font-bold text-indigo-600 tracking-widest uppercase mb-1">Database</p>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">
                  Participant management
                </h1>
                <p className="text-sm text-slate-500">
                  Manage your event participants and issue attendance certificates.
                </p>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex justify-between items-end">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Total Absen</p>
                    <p className="text-3xl font-bold text-slate-900">9</p>
                  </div>
                </div>
                <div className="text-[10px] font-medium text-slate-400 pb-1">
                  +12% this month
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex justify-between items-end">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Attendance rate</p>
                    <p className="text-3xl font-bold text-slate-900">56%</p>
                  </div>
                </div>
                <div className="text-[10px] font-medium text-slate-400 pb-1">
                  5 checked in
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex justify-between items-end">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                    <FileBadge className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Certificates issued</p>
                    <p className="text-3xl font-bold text-slate-900">68</p>
                  </div>
                </div>
                <div className="text-[10px] font-medium text-slate-400 pb-1">
                  12 pending
                </div>
              </div>
            </div>

            {/* Participant Data Table Component */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
              <ParticipantTable />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


