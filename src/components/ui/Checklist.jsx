import { assets } from "../../assets";

export function CheckItem({ children }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-mint p-1">
        <img src={assets.icons.check} alt="" className="size-2.5" />
      </span>
      <span className="text-sm font-semibold text-ink">{children}</span>
    </li>
  );
}

export default function Checklist({ items }) {
  return (
    <ul className="flex w-full flex-col gap-3">
      {items.map((item) => <CheckItem key={item}>{item}</CheckItem>)}
    </ul>
  );
}
