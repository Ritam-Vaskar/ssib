import { Link } from 'react-router-dom'
import styles from '../../styles/components/footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>SSIB Service</h3>
          <p>Professional security solutions for your peace of mind.</p>
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
            <li>Security Guards</li>
            <li>Event Security</li>
            <li>Residential Security</li>
            <li>Corporate Security</li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Contact Info</h4>
          <ul>
            <li>📍 123 Security Street</li>
            <li>📞 +1 (555) 123-4567</li>
            <li>✉️ info@ssibservice.com</li>
          </ul>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} SSIB Service. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer