import Button from "../ui/Button";
import Section from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";
import { popularServices } from "../../data/content";

function ServiceCard({ title, text, image, overlay, solidLabel, className = "" }) {
  return (
    <article className={`relative flex h-[385px] flex-col justify-end overflow-hidden rounded-[20px] p-4 ${className}`}>
      <img src={image} alt="" className="absolute inset-0 size-full object-cover" />
      <div className={`absolute inset-0 ${overlay}`} />
      <div className={`relative flex flex-col gap-1 rounded-xl p-4 shadow-label ${solidLabel ? "bg-white" : "bg-white/90"}`}>
        <h3 className="text-base font-bold text-ink">{title}</h3>
        <p className="text-xs text-muted">{text}</p>
      </div>
    </article>
  );
}

export default function PopularServices() {
  const [a, b, c, d] = popularServices;
  return (
    <Section className="bg-white py-24">
      <div className="flex flex-col gap-12">
        <SectionHeader
          overline="Our Popular Services"
          action={<Button variant="outline" className="shrink-0">View All Services</Button>}
        >
          Complete Solutions for Your <span className="text-accent">RO Repair</span> Needs
        </SectionHeader>
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ServiceCard {...a} />
            <ServiceCard {...b} />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[628px_1fr]">
            <ServiceCard {...c} />
            <ServiceCard {...d} />
          </div>
        </div>
      </div>
    </Section>
  );
}
