import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import logo from "../../assets/logo.jpg";

const navItems = [
  { to: "/", label: "Beranda" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/analytics", label: "Analitik" },
  { to: "/settings", label: "Pengaturan" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="HYTERA"
            className="h-10 w-10 rounded-xl object-cover"
          />
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-text">
                HERA
              </span>
              <span className="hidden rounded-full border border-border bg-black/3 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-text-secondary uppercase sm:inline">
                B2B Heat Exchange
              </span>
            </div>
            <p className="hidden text-[11px] text-text-secondary sm:block">
              Heat Exchange &amp; Recovery Automation
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative py-2 text-sm font-semibold text-text-secondary transition-colors hover:text-text",
                  isActive && "text-turquoise-dark",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-[1px] h-0.5 rounded-full bg-turquoise" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-text-secondary hover:text-text"
            aria-label="Notifikasi"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-red" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              AW
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-text">Andi Wijaya</p>
              <p className="text-xs text-text-secondary">PT Semen Nusantara</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Buka menu navigasi"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-surface px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2.5 text-sm font-semibold text-text-secondary",
                    isActive && "bg-turquoise/10 text-turquoise-dark",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                AW
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-text">Andi Wijaya</p>
                <p className="text-xs text-text-secondary">
                  PT Semen Nusantara
                </p>
              </div>
            </div>
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary"
              aria-label="Notifikasi"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-red" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
