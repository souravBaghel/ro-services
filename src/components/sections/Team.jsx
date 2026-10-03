import Button from "../ui/Button";
import Section from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";
import { team } from "../../data/content";

function TeamCard({ name, role, image }) {
  return (
    <article className="flex flex-col gap-4">
      <img src={image} alt={name} className="h-[280px] w-full rounded-2xl object-cover" />
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold text-ink">{name}</h3>
        <p className="text-[13px] font-semibold text-accent">{role}</p>
      </div>
    </article>
  );
}

export default function Team() {
  return (
    <Section id="testimonials" className="bg-white py-24">
      <div className="flex flex-col gap-12">
        <SectionHeader overline="Meet Our Team" action={<Button variant="outline" className="shrink-0">Join Our Team</Button>}>
          Skilled. Friendly. Professional.
        </SectionHeader>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => <TeamCard key={m.name} {...m} />)}
        </div>
      </div>
    </Section>
  );
}
