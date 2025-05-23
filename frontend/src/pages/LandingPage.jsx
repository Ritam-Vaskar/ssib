import Hero from '../components/landing/Hero';
import Services from '../components/landing/Services';
import Gallery from '../components/landing/Gallery';
import Testimonials from '../components/landing/Testimonials';
import Contact from '../components/landing/Contact';
import styles from '../styles/pages/landingPage.module.css';

const LandingPage = () => {
  return (
    <div className={styles.landingPage}>
      {/* <Navbar /> */}
      <Hero />
      <Services />
      <Gallery />
      <Testimonials />
      <Contact />
      {/* <Footer /> */}
    </div>
  );
};

export default LandingPage;