import { CreditCard } from "lucide-react";
import { NavLink } from "react-router";

interface SidebarNavProps {
  onNavigate?: () => void;
}

function SidebarNav({ onNavigate }: SidebarNavProps) {
  return (
    <nav aria-label="Main navigation" className="flex-1 px-3 py-4">
      <ul role="list" className="flex flex-col gap-1">
        <li>
          <NavLink
            to="/"
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-sky-400 ${isActive ? "bg-sky-50 text-sky-700" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`
            }
            aria-current={({ isActive }) => (isActive ? "page" : undefined)}
          >
            <CreditCard size={18} aria-hidden="true" />
            Card
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export { SidebarNav };
export type { SidebarNavProps };
