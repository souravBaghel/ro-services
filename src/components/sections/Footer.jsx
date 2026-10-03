import Logo from "../ui/Logo";
import Section from "../ui/Section";
import { footerColumns } from "../../data/content";

export default function Footer() {
  return (
    <Section className="bg-ink pb-10 pt-[60px]">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col justify-between gap-10 lg:flex-row">
          <div className="flex max-w-[320px] flex-col gap-4">
            <Logo mark="SB" label="Home Services" inverse />
            <p className="text-[13px] leading-normal text-subtle">
              Covering: Satellite, Bopal, Navrangpura, Prahlad Nagar, Vastrapur, Maninagar, Gota &amp; all of Ahmedabad
            </p>
          </div>
          <div className="flex flex-wrap gap-10 lg:gap-16">
            {footerColumns.map((col) => (
              <div key={col.title} className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-white">{col.title}</h3>
                {col.links.map((l) => <a key={l} href="#" className="text-[13px] text-subtle hover:text-white">{l}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 text-xs text-subtle sm:flex-row">
          <p>© 2026 SB Home Services. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </Section>
  );
}
