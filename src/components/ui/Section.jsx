export default function Section({ id, className = "", children }) {
  return (
    <section id={id} className={`w-full px-6 lg:px-20 ${className}`}>
      <div className="mx-auto w-full max-w-[1280px]">{children}</div>
    </section>
  );
}
