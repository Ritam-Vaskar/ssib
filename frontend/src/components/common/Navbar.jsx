import { Link } from 'react-router-dom'
import styles from '../../styles/components/navbar.module.css'

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">SSIB Service</Link>
      </div>
      <div className={styles.navLinks}>
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/login" className={styles.loginBtn}>Login</Link>
        <Link to="/signup" className={styles.signupBtn}>Sign Up</Link>
      </div>
    </nav>
  )
}

export default Navbar