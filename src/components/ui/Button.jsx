const variants = {
  primary: "bg-brand text-white hover:bg-brand/90",
  outline: "bg-white text-ink border border-line hover:bg-gray-50",
};

export default function Button({ variant = "primary", className = "", children, as: Tag = "button", ...props }) {
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-6 py-3 text-xl font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
