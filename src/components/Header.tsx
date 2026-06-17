import Link from "next/link";
import { navLinks, site } from "@/content/site";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
      <Link href="/" className="flex items-center gap-3 text-sm font-medium tracking-wide">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/20 text-[10px] font-semibold tracking-tight">
          OVI
        </span>
        <span className="hidden sm:inline">{site.name}</span>
      </Link>

      <nav className="hidden items-center gap-8 text-sm lg:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="opacity-80 transition hover:opacity-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4 text-sm">
        <Link
          href="#contact"
          className="rounded-full bg-[#ececec] px-4 py-1.5 text-xs font-medium text-black transition hover:bg-white"
        >
          {site.cta}
        </Link>
      </div>
    </header>
  );
}
