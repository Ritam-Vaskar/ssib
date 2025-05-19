import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from '../../styles/components/navbar.module.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo}>
        <Link to="/"><span style={{ color: '#007bff' }}>SSIB</span> Service</Link>
      </div>
      
      <div className={styles.hamburger} onClick={toggleMenu}>
        <span className={`${styles.bar} ${isMenuOpen ? styles.active : ''}`}></span>
        <span className={`${styles.bar} ${isMenuOpen ? styles.active : ''}`}></span>
        <span className={`${styles.bar} ${isMenuOpen ? styles.active : ''}`}></span>
      </div>
      
      <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
        <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link to="/services" onClick={() => setIsMenuOpen(false)}>Services</Link>
        <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
        <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
        <div className={styles.authButtons}>
          <Link to="/login" className={styles.loginBtn} onClick={() => setIsMenuOpen(false)}>Login</Link>
          <Link to="/signup" className={styles.signupBtn} onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar