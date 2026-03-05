import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { Button } from "../Button/Button";
import { SidebarNav } from "./SidenarNav/SidebarNav";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (): void => {
    setMenuOpen(false);
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md"
      >
        Skip to main content
      </a>
      <div className="flex min-h-screen">
        <aside
          className="fixed left-0 top-0 hidden h-screen w-52 flex-col border-r bg-white md:flex"
          aria-label="Sidebar"
        >
          <div className="flex items-center justify-center border-b px-4 py-6">
            <Link to="/" aria-label="DKB Home">
              <img
                src="/dkb-logo.webp"
                alt=""
                aria-hidden="true"
                width={80}
                height={26}
                className="w-20"
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
                alt="DKB — Das kann Bank"
                width={48}
                height={16}
                className="w-12"
              />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? (
                <X size={20} aria-hidden="true" />
              ) : (
                <Menu size={20} aria-hidden="true" />
              )}
            </Button>
          </header>

          {menuOpen && (
            <div id="mobile-navigation" className="border-b bg-white shadow-md">
              <SidebarNav onNavigate={handleNavigate} />
            </div>
          )}
        </div>

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 bg-muted/30 pt-14 md:ml-52 md:pt-0"
        >
          {children}
        </main>
      </div>
    </>
  );
}

export { AppLayout };
export type { AppLayoutProps };
