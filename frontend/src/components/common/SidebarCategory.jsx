import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import SidebarNavItem from "./SidebarNavItem";

/**
 * Collapsible Accordion Category Section for Studio Departments
 */
const SidebarCategory = ({
  department,
  isOpen,
  onToggle,
  currentPath,
  onItemClick,
}) => {
  const hasActiveChild = department.items.some((i) => i.path === currentPath);

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`dept-${department.id}`}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-lg transition-colors cursor-pointer group"
      >
        <span className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown size={14} className="text-violet-400 transition-transform" />
          ) : (
            <ChevronRight size={14} className="text-slate-500 transition-transform" />
          )}
          <span className={hasActiveChild ? "text-violet-300 font-extrabold" : ""}>
            {department.title}
          </span>
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:bg-slate-700">
          {department.items.length}
        </span>
      </button>

      {isOpen && (
        <div id={`dept-${department.id}`} className="mt-1 space-y-1 pl-2 border-l border-slate-800/80 ml-3">
          {department.items.map((item) => (
            <SidebarNavItem
              key={item.path}
              item={item}
              isActive={currentPath === item.path}
              onClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarCategory;
