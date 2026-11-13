import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Logo from "../ui/Logo";
import { navLinks, PHONE } from "../../data/content";

export default function Header({ onBook }) {
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(
    () => window.location.hash || navLinks[0].href
  );

  useEffect(() => {
    const updateActiveLink = () => {
      const headerOffset = document.querySelector("header")?.offsetHeight ?? 0;
      const currentPosition = window.scrollY + headerOffset;
      const sections = navLinks
        .map((link) => document.querySelector(link.href))
        .filter(Boolean)
        .map((section) => ({
          id: section.id,
          top: section.getBoundingClientRect().top + window.scrollY,
        }));
      const currentSection = sections
        .filter((section) => section.top <= currentPosition)
        .sort((a, b) => b.top - a.top)[0];

      if (currentSection) {
        setActiveHref(`#${currentSection.id}`);
      }
    };

    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink, { passive: true });
    window.addEventListener("hashchange", updateActiveLink);

    return () => {
      window.removeEventListener("scroll", updateActiveLink);
      window.removeEventListener("hashchange", updateActiveLink);
    };
  }, []);

  const linkClassName = (href) =>
    href === activeHref
      ? "active text-brand"
      : "text-muted hover:text-brand";

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white px-6 py-5 lg:px-20">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between">
        <Logo mark="RO" label="Services" />
        <nav className="hidden gap-8 text-sm font-semibold md:flex">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={linkClassName(l.href)}
              aria-current={l.href === activeHref ? "location" : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a href={`tel:${PHONE.replace(/[^\d]/g, "")}`} className="hidden text-[15px] font-bold text-brand sm:block">{PHONE}</a>
          <Button className="hidden md:inline-flex" onClick={onBook}>Book Now</Button>
          <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>
            <span className="block h-0.5 w-6 bg-ink shadow-[0_6px_0_#111827,0_-6px_0_#111827]" />
          </button>
        </div>
      </div>
      {open && (
        <nav className="mt-4 flex flex-col gap-3 text-sm font-semibold md:hidden">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={linkClassName(l.href)}
              aria-current={l.href === activeHref ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <Button className="w-full" onClick={() => { setOpen(false); onBook(); }}>Book Now</Button>
        </nav>
      )}
    </header>
  );
}
