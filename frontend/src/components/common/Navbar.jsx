import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from '../../styles/components/navbar.module.css'

const Navbar = ({ isAuthenticated, userRole }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    window.location.href = '/';
  }

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
          {!isAuthenticated ? (
            <>
              <Link to="/login" className={styles.loginBtn} onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/signup" className={styles.signupBtn} onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
            </>
          ) : (
            <>
              <Link 
                to={`/${userRole?.toLowerCase()}-dashboard`} 
                className={styles.profileBtn} 
                onClick={() => setIsMenuOpen(false)}
              >
                <img 
                  src="/profile-icon.svg" 
                  alt="Profile" 
                  className={styles.profileIcon} 
                />
              </Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar