export default function Overline({ children, className = "" }) {
  return <p className={`text-xs font-bold uppercase text-accent ${className}`}>{children}</p>;
}
