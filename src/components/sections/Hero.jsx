import { assets } from "../../assets";
import Button from "../ui/Button";
import Checklist from "../ui/Checklist";
import Section from "../ui/Section";
import { heroChecks } from "../../data/content";

export default function Hero() {
  return (
    <div id="home" className="relative overflow-hidden bg-hero-bg">
      <img src={assets.heroBg} alt="" className="pointer-events-none absolute inset-0 size-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white from-[43%] to-white/0" />
      <Section className="relative py-12">
        <div className="flex flex-col items-center gap-16 lg:flex-row">
          <div className="flex flex-1 flex-col gap-10">
            <div className="flex flex-col gap-6">
              <span className="w-fit rounded-full bg-mint px-3 py-1.5 text-xs font-bold text-brand">★ #1 Rated Home Services</span>
              <h1 className="text-4xl font-extrabold leading-[1.15] text-ink sm:text-5xl lg:text-[54px]">
                RO Water Purifier <br className="hidden sm:block" />Repair &amp; Installation
                <br className="hidden sm:block" />
                <span className="text-brand"> Just One Click</span> Away
              </h1>
              <p className="text-lg leading-relaxed text-muted lg:text-xl">
                Fast, affordable RO service at your doorstep anywhere in Ahmedabad. Expert technicians for all brands — repairs, new fitting, filter replacement &amp; AMC.
              </p>
              <Checklist items={heroChecks} />
            </div>
            <div className="flex flex-wrap gap-4">
              <Button>Book a Service</Button>
              <Button variant="outline">Explore Services</Button>
            </div>
          </div>

          <div className="relative w-full max-w-[587px] shrink-0 lg:w-[587px]">
            <img src={assets.heroMain} alt="Technician servicing an RO water purifier" className="block w-full" />
            <div className="absolute bottom-[120px] left-2 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-badge lg:-left-6">
              <img src={assets.icons.responseFrame} alt="" className="size-10" />
              <div className="flex flex-col gap-0.5 whitespace-nowrap">
                <p className="text-sm font-bold text-ink">Response Time ~2 Hrs</p>
                <p className="text-[11px] text-muted">In Ahmedabad City</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
