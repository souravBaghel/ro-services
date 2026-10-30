import Overline from "./Overline";

export default function SectionHeader({ overline, children, align = "left", action, className = "" }) {
  const center = align === "center";
  return (
    <div className={`flex w-full flex-col gap-6 ${center ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"} ${className}`}>
      <div className={`flex flex-col gap-3 ${center ? "items-center text-center" : "items-start"}`}>
        <Overline>{overline}</Overline>
        <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">{children}</h2>
      </div>
      {action}
    </div>
  );
}
