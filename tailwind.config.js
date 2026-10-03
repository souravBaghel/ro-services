/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"] },
      colors: {
        brand: "#0d5c4c",
        mint: "#e6f4f1",
        "hero-bg": "#eff4f1",
        accent: "#10b981",
        ink: "#111827",
        muted: "#4b5563",
        line: "#e5e7eb",
        page: "#f8fafc",
        subtle: "#9ca3af",
      },
      boxShadow: {
        badge: "0 8px 12px rgba(0,0,0,0.06)",
        card: "0 4px 6px rgba(0,0,0,0.02)",
        label: "0 4px 16px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
