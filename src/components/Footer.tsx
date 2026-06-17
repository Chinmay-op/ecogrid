import Link from "next/link";
import { navLinks, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="relative z-20 border-t border-black/10 bg-[#ececec] px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-medium">{site.name}</p>
          <p className="mt-1 max-w-md text-sm text-black/60">{site.tagline}</p>
        </div>
        <nav className="flex flex-wrap gap-5 text-sm">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-black/70 transition hover:text-black">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
