import { useState } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import Materials from "./components/sections/Materials";
import Catalog from "./components/sections/Catalog";
import MaterialGuide from "./components/sections/MaterialGuide";
import About from "./components/sections/About";
import FAQ from "./components/sections/FAQ";
import Contact from "./components/sections/Contact";
import Testimonials from "./components/sections/Testimonials";
export default function App() {
  const [material, setMaterial] = useState("pla");
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <Materials onSelect={setMaterial} />
        <Catalog />
        <MaterialGuide active={material} setActive={setMaterial} />
        <About />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
