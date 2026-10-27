import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Search } from "lucide-react";

import { NAVIGATION_DEPARTMENTS } from "../../config/navigationConfig";
import SidebarCategory from "./SidebarCategory";
import SidebarNavItem from "./SidebarNavItem";
import ThemeToggle from "./ThemeToggle";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategories, setOpenCategories] = useState(() => {
    // Open all categories by default for immediate discoverability
    return NAVIGATION_DEPARTMENTS.reduce((acc, dept) => {
      acc[dept.id] = true;
      return acc;
    }, {});
  });

  // Ensure current active category is always open on route change
  useEffect(() => {
    const activeDept = NAVIGATION_DEPARTMENTS.find((dept) =>
      dept.items.some((item) => item.path === location.pathname)
    );
    if (activeDept) {
      setOpenCategories((prev) => ({ ...prev, [activeDept.id]: true }));
    }
  }, [location.pathname]);

  const toggleCategory = (id) => {
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered items when searching
  const filteredDepartments = useMemo(() => {
    if (!searchQuery.trim()) return NAVIGATION_DEPARTMENTS;
    const query = searchQuery.toLowerCase().trim();

    return NAVIGATION_DEPARTMENTS.map((dept) => ({
      ...dept,
      items: dept.items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          dept.title.toLowerCase().includes(query)
      ),
    })).filter((dept) => dept.items.length > 0);
  }, [searchQuery]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 flex flex-col
          transition-transform duration-300 ease-in-out
          md:static md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          backgroundColor: "var(--surface)",
          borderRight: "1px solid var(--border)",
        }}
      >
        {/* Header Branding */}
        <div className="flex justify-between items-center p-5 border-b border-slate-800/80 shrink-0">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-violet-500/20">
              C
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-violet-500 group-hover:text-violet-400 transition-colors">
                CineVerse
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                Studio Management
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Search */}
        <div className="p-3 border-b border-slate-800/60 shrink-0">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search departments & tools..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-900/60 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-violet-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Categorized Navigation List */}
        <nav className="p-3 overflow-y-auto flex-1 scrollbar-thin space-y-1">
          {filteredDepartments.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              No matching tools or departments found.
            </div>
          ) : (
            filteredDepartments.map((dept) =>
              searchQuery.trim() ? (
                // When actively searching, flatten the view for direct click access
                <div key={dept.id} className="mb-3">
                  <div className="text-[10px] uppercase font-bold text-slate-500 px-3 py-1">
                    {dept.title}
                  </div>
                  {dept.items.map((item) => (
                    <SidebarNavItem
                      key={item.path}
                      item={item}
                      isActive={location.pathname === item.path}
                      onClick={onClose}
                    />
                  ))}
                </div>
              ) : (
                <SidebarCategory
                  key={dept.id}
                  department={dept}
                  isOpen={Boolean(openCategories[dept.id])}
                  onToggle={() => toggleCategory(dept.id)}
                  currentPath={location.pathname}
                  onItemClick={onClose}
                />
              )
            )
          )}
        </nav>

        {/* Footer with ThemeToggle */}
        <div
          className="p-3 border-t shrink-0 flex items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="text-[11px] text-slate-400 font-medium">Theme Mode</span>
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
