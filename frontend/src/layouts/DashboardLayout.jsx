import { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import { Menu } from "lucide-react";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070B17] flex flex-col md:flex-row">
      {/* Mobile Top Navigation */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#0B1020] border-b border-slate-800 shrink-0">
        <h1 className="text-2xl font-bold text-violet-500">CineVerse</h1>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-slate-400 hover:text-white p-2 cursor-pointer animate-pulse-subtle"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto w-full max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
