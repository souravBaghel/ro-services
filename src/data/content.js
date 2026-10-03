import { assets } from "../assets";

export const PHONE = "(800) 555-0199";

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "About Us", href: "#about" },
];

export const heroChecks = ["Same-day repair service", "New RO supply & fitting", "All major brands covered"];

export const categories = [
  { icon: assets.icons.wrench, title: "RO Repair & Service", text: "Same-day service at your doorstep" },
  { icon: assets.icons.bolt, title: "New RO Installation", text: "Supply & fitting of all brands" },
  { icon: assets.icons.brush, title: "Annual Maintenance", text: "AMC plans starting ₹999/yr" },
  { icon: assets.icons.sparkles, title: "Cleaning", text: "Deep sanitization for houses and professional offices." },
];

export const aboutChecks = [
  "Professional RO Expert",
  "New RO supply & fitting",
  "On-Time Arrival & Efficient Work",
  "Your Complete Satisfaction is Our Priority",
];

export const popularServices = [
  { title: "RO Installation", text: "Fresh installation of any RO unit at your home or office with proper pressure and TDS testing.", image: assets.service[0], overlay: "bg-black/0" },
  { title: "Filter Replacement", text: "Genuine replacement filters: pre-filter, carbon filter, RO membrane, post-carbon, and UV lamp change.", image: assets.service[1], overlay: "bg-black/5" },
  { title: "Deep Cleaning", text: "Complete internal cleaning of water tank, pipelines, and all chambers to eliminate bacteria and scale.", image: assets.service[2], overlay: "bg-black/10" },
  { title: "Emergency Repair", text: "Leaking water? No output? Low pressure? Our technician reaches within 2–4 hours anywhere in Ahmedabad.", image: assets.service[3], overlay: "bg-black/10", solidLabel: true },
];

export const steps = [
  { icon: assets.icons.phone, title: "Call or Book Online", text: "Contact us anytime. Tell us your issue and location in Ahmedabad." },
  { icon: assets.icons.truck, title: "Technician Dispatched", text: "Our certified expert reaches you within 2 hours, with all tools." },
  { icon: assets.icons.thumbsUp, title: "Repair & Satisfaction", text: "Problem fixed, water tested, and you enjoy pure clean water again." },
];

export const team = [
  { name: "Mike Johnson", role: "Plumbing Expert", image: assets.team[0] },
  { name: "Emily Davis", role: "Cleaning Specialist", image: assets.team[1] },
  { name: "James Wilson", role: "Electrical Expert", image: assets.team[2] },
];

export const footerColumns = [
  { title: "Services", links: ["Plumbing Repairs", "Electrical Upgrades", "House Painting", "Deep Cleaning"] },
  { title: "Company", links: ["About Us", "Our Experts", "Careers", "Contact Us"] },
  { title: "Contact Info", links: ["support@sbhomeservices.com", "123 Service Way, Ste 100", PHONE] },
];
