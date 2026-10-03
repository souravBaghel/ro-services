import Header from "./components/sections/Header";
import Hero from "./components/sections/Hero";
import Categories from "./components/sections/Categories";
import About from "./components/sections/About";
import PopularServices from "./components/sections/PopularServices";
import HowItWorks from "./components/sections/HowItWorks";
import Team from "./components/sections/Team";
import FooterCTA from "./components/sections/FooterCTA";
import Footer from "./components/sections/Footer";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Header />
      <main>
        <Hero />
        <Categories />
        <About />
        <PopularServices />
        <HowItWorks />
        <Team />
        <FooterCTA />
      </main>
      <Footer />
    </div>
  );
}
