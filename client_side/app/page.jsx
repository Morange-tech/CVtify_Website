'use client';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import HowItWorksSection from './components/HowItWorksSection';
import FeaturesSection from './components/FeaturesSection';
import TemplatesSection from './components/TemplatesSection';
import WhoItsForSection from './components/WhoItsForSection';
import ScrollToTop from './components/ScrollToTop';
import { motion } from 'framer-motion';


export default function Home() {
  return (
    <main>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.6 }}
      >
        <Hero />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, delay: 0.6 }}
      >
        <HowItWorksSection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, delay: 0.6 }}
      >
        <FeaturesSection />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, delay: 0.6 }}
      >
        <TemplatesSection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, delay: 0.6 }}
      >
        <WhoItsForSection />
      </motion.div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}