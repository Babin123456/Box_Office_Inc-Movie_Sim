import React from "react";
import { Link } from "react-router-dom";

/**
 * Accessible Sidebar Navigation Link Item
 */
const SidebarNavItem = ({ item, isActive, onClick }) => {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
        ${
          isActive
            ? "bg-violet-600 text-white shadow-sm shadow-violet-500/20 font-semibold"
            : "text-slate-300 hover:text-white hover:bg-slate-800/70"
        }
      `}
    >
      <Icon
        size={18}
        className={`shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}
      />
      <span className="truncate">{item.name}</span>
    </Link>
  );
};

export default SidebarNavItem;
