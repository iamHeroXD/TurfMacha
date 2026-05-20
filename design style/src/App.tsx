import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { Turfs } from './pages/Turfs';
import { TurfDetail } from './pages/TurfDetail';
import { HowItWorks } from './pages/HowItWorks';
import { ForOwners } from './pages/ForOwners';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { Legal } from './pages/Legal';
import { Auth } from './pages/Auth';
import { Download } from './pages/Download';
import { NotFound } from './pages/NotFound';
export function App() {
  return (
    <div className="min-h-screen bg-turf-cream font-sans flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/turfs" element={<Turfs />} />
          <Route path="/turfs/:id" element={<TurfDetail />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/for-owners" element={<ForOwners />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/download" element={<Download />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>);

}