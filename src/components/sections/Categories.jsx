import Section from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";
import { categories } from "../../data/content";

function CategoryCard({ icon, title, text }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-6 shadow-card">
      <div className="flex size-12 items-center justify-center rounded-xl bg-mint p-3">
        <img src={icon} alt="" className="size-6" />
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-bold text-ink">{title}</h3>
        <p className="text-xs leading-normal text-muted">{text}</p>
      </div>
    </article>
  );
}

export default function Categories() {
  return (
    <Section id="services" className="bg-white py-24">
      <div className="flex flex-col gap-14">
        <SectionHeader overline="What We Do" align="center">
          Our Services in <span className="text-accent">Ahmedabad</span>
        </SectionHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => <CategoryCard key={c.title} {...c} />)}
        </div>
      </div>
    </Section>
  );
}
