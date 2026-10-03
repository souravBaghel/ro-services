import { assets } from "../../assets";
import Button from "../ui/Button";
import Section from "../ui/Section";
import { PHONE } from "../../data/content";

export default function FooterCTA() {
  return (
    <Section className="bg-mint py-16">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
        <div className="flex max-w-[640px] flex-col gap-3">
          <h2 className="text-[28px] font-extrabold text-brand">Need RO Service in Ahmedabad?</h2>
          <p className="text-[15px] text-muted">Reach us anytime — our team is ready across all areas of Ahmedabad city.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-bold uppercase text-muted">Call Us Now</p>
            <a href={`tel:${PHONE.replace(/[^\d]/g, "")}`} className="text-[22px] font-extrabold text-brand">{PHONE}</a>
          </div>
          <Button>
            Whatsup
            <img src={assets.whatsapp} alt="" className="size-7 object-cover" />
          </Button>
        </div>
      </div>
    </Section>
  );
}
