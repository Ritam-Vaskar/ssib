import { Link } from 'react-router-dom'
import styles from '../../styles/components/footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>SSIB Service</h3>
          <p>Professional security solutions for your peace of mind.</p>
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
        <div className={styles.footerSection}>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Services</h4>
          <ul>
            <li><Link to="/services">Security Guards</Link></li>
            <li><Link to="/services">Event Security</Link></li>
            <li><Link to="/services">Residential Security</Link></li>
            <li><Link to="/services">Corporate Security</Link></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Contact Info</h4>
          <ul className={styles.contactInfo}>
            <li><span className={styles.icon}>📍</span> 123 Security Street</li>
            <li><span className={styles.icon}>📞</span> +1 (555) 123-4567</li>
            <li><span className={styles.icon}>✉️</span> info@ssibservice.com</li>
          </ul>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} SSIB Service. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer