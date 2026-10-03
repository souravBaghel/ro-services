export default function Logo({ mark, label, inverse = false }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`rounded-lg p-2 text-lg font-extrabold ${inverse ? "bg-white text-brand" : "bg-brand text-white"}`}>
        {mark}
      </span>
      <span className={`text-xl font-extrabold ${inverse ? "text-white" : "text-ink"}`}>{label}</span>
    </div>
  );
}
