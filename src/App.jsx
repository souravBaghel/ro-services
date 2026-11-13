import { useState } from "react";
import Header from "./components/sections/Header";
import Hero from "./components/sections/Hero";
import Categories from "./components/sections/Categories";
import About from "./components/sections/About";
import PopularServices from "./components/sections/PopularServices";
import HowItWorks from "./components/sections/HowItWorks";
import Team from "./components/sections/Team";
import FooterCTA from "./components/sections/FooterCTA";
import Footer from "./components/sections/Footer";
import BookingForm from "./components/ui/BookingForm";
import AdminDashboard from "./components/ui/AdminDashboard";

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  if (window.location.pathname === "/admin" || window.location.pathname === "/admin/") {
    return <AdminDashboard />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Header onBook={() => setBookingOpen(true)} />
      <main>
        <Hero onBook={() => setBookingOpen(true)} />
        <Categories />
        <About onBook={() => setBookingOpen(true)} />
        <PopularServices />
        <HowItWorks />
        <Team />
        <FooterCTA />
      </main>
      <Footer />
      {bookingOpen && <BookingForm onClose={() => setBookingOpen(false)} />}
    </div>
  );
}
