import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { SidebarNav } from "./SidebarNav/SidebarNav";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handleNavigate = (): void => {
    setMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 hidden h-screen w-52 flex-col border-r bg-white md:flex">
        <div className="flex items-center justify-center border-b p-4">
          <Link to="/" aria-label="DKB Home">
            <img
              src="/dkb-logo.webp"
              alt="DKB — Das kann Bank logo"
              className="w-20"
              width={80}
              height={26}
            />
          </Link>
        </div>
        <SidebarNav />
      </aside>

      <div className="fixed left-0 right-0 top-0 z-10 md:hidden">
        <header className="flex h-14 items-center justify-between border-b bg-white px-4">
          <Link to="/" aria-label="DKB Home">
            <img
              src="/dkb-logo.webp"
              alt="DKB — Das kann Bank logo"
              className="w-12"
              width={48}
              height={16}
            />
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-md p-1.5 focus-visible:outline-2 focus-visible:outline-sky-400"
          >
            {menuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </header>

        {menuOpen && (
          <div id="mobile-navigation" className="border-b bg-white shadow-md">
            <SidebarNav onNavigate={handleNavigate} />
          </div>
        )}
      </div>

      <main className="flex-1 bg-muted/30 pt-14 md:ml-52 md:pt-0">
        {children}
      </main>
    </div>
  );
}

export { AppLayout };
export type { AppLayoutProps };
