import { useState, useEffect } from 'react';
import styles from '../../styles/components/navigation.module.css';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll event to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle smooth scrolling to sections
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo} onClick={() => scrollToSection('home')}>
          <span>SSIB</span> Security
        </div>

        {/* Desktop Navigation */}
        <ul className={styles.navLinks}>
          <li onClick={() => scrollToSection('home')}>Home</li>
          <li onClick={() => scrollToSection('services')}>Services</li>
          <li onClick={() => scrollToSection('gallery')}>Gallery</li>
          <li onClick={() => scrollToSection('testimonials')}>Testimonials</li>
          <li onClick={() => scrollToSection('contact')}>Contact</li>
        </ul>

        {/* Mobile Menu Button */}
        <div 
          className={`${styles.mobileMenuBtn} ${mobileMenuOpen ? styles.open : ''}`} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Mobile Navigation */}
        <div className={`${styles.mobileNav} ${mobileMenuOpen ? styles.open : ''}`}>
          <ul>
            <li onClick={() => scrollToSection('home')}>Home</li>
            <li onClick={() => scrollToSection('services')}>Services</li>
            <li onClick={() => scrollToSection('gallery')}>Gallery</li>
            <li onClick={() => scrollToSection('testimonials')}>Testimonials</li>
            <li onClick={() => scrollToSection('contact')}>Contact</li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;