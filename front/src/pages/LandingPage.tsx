import { useLocation } from "react-router-dom";
import Brands from "../components/sections/Brands";
import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "../components/sections/Hero";
import Materials from "../components/sections/Materials";
import Catalog from "../components/sections/Catalog";
import MaterialGuide from "../components/sections/MaterialGuide";
import About from "../components/sections/About";
import FAQ from "../components/sections/FAQ";
import Contact from "../components/sections/Contact";
import Testimonials from "../components/sections/Testimonials";
export default function LandingPage() {
  const [material, setMaterial] = useState("pla");
  const [brand, setBrand] = useState("Todas");
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const target = hash === "#produtos" ? "catalogo" : hash.slice(1);
    const frame = requestAnimationFrame(() =>
      document.getElementById(target)?.scrollIntoView(),
    );
    return () => cancelAnimationFrame(frame);
  }, [hash]);
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <Materials onSelect={setMaterial} />
        <Brands onCatalogBrand={setBrand} />
        <Catalog brandFilter={brand} onBrandFilterChange={setBrand} />
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
