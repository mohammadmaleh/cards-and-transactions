import { useState, type ReactNode } from "react"
import { NavLink } from "react-router"
import { CreditCard, Menu, X } from "lucide-react"

interface AppLayoutProps {
  children: ReactNode
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Main navigation" className="flex-1 px-3 py-4">
      <ul role="list" className="flex flex-col gap-1">
        <li>
          <NavLink
            to="/"
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sky-50 text-sky-700"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <CreditCard size={18} aria-hidden="true" />
            Karten
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

function AppLayout({ children }: AppLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 hidden h-screen w-52 flex-col border-r bg-white md:flex">
        <div className="flex items-center justify-center border-b px-4 py-6">
          <img src="/dkb-logo.webp" alt="DKB — Das kann Bank" className="w-20" />
        </div>
        <SidebarNav />
      </aside>

      <div className="fixed left-0 right-0 top-0 z-10 md:hidden">
        <header className="flex h-14 items-center justify-between border-b bg-white px-4">
          <img src="/dkb-logo.webp" alt="DKB — Das kann Bank" className="w-12" />
          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </header>

        {menuOpen && (
          <div className="border-b bg-white shadow-md">
            <SidebarNav onNavigate={() => setMenuOpen(false)} />
          </div>
        )}
      </div>

      <main className="flex-1 bg-muted/30 pt-14 md:ml-52 md:pt-0">{children}</main>
    </div>
  )
}

export { AppLayout }
export type { AppLayoutProps }
