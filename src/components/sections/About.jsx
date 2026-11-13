import { assets } from "../../assets";
import Button from "../ui/Button";
import Checklist from "../ui/Checklist";
import Overline from "../ui/Overline";
import Section from "../ui/Section";
import { aboutChecks } from "../../data/content";

export default function About({ onBook }) {
  return (
    <Section id="about" className="bg-mint py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[579px_1fr] lg:gap-24">
        <img src={assets.about} alt="Technician repairing a water purifier" className="h-[494px] w-full rounded-2xl object-cover" />
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Overline>About</Overline>
            <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">Affordable Water Purifier Repair Services</h2>
            <p className="text-[15px] leading-relaxed text-muted">
              Get reliable and affordable water purifier repair services in Ahmedabad from experienced technicians. We provide quick solutions for RO, UV, and other water purifier problems, including filter replacement, water leakage, low water flow, unusual noise, and purification issues. Our technicians use quality spare parts and provide transparent pricing with professional service at your doorstep.
            </p>
          </div>
          <Checklist items={aboutChecks} />
          <Button className="w-fit" onClick={onBook}>Book a Service</Button>
        </div>
      </div>
    </Section>
  );
}
