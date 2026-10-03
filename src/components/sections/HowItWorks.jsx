import Section from "../ui/Section";
import { steps } from "../../data/content";

function Step({ icon, title, text }) {
  return (
    <div className="flex flex-1 gap-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08]">
        <img src={icon} alt="" className="size-6" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-white">{title}</h3>
        <p className="text-[13px] leading-normal text-slate-200">{text}</p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <Section className="bg-brand py-[60px]">
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm font-bold uppercase text-accent">Simple Process</p>
          <h2 className="text-[28px] font-extrabold text-white">How It Works</h2>
        </div>
        <div className="flex w-full flex-col gap-8 md:flex-row md:gap-12">
          {steps.map((s) => <Step key={s.title} {...s} />)}
        </div>
      </div>
    </Section>
  );
}
