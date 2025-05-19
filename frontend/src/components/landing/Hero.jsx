import { useNavigate } from 'react-router-dom';
import styles from '../../styles/components/hero.module.css'

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.hero} id="home">
      <div className={styles.content}>
        <h1>Professional Security Services</h1>
        <p>Protecting what matters most with trusted, reliable and comprehensive security solutions for businesses and individuals</p>
        <div className={styles.cta}>
          <button className={styles.primaryBtn} onClick={() => navigate('/login')}>Get Started</button>
          <button className={styles.secondaryBtn} onClick={() => navigate('/services')}>Learn More</button>
        </div>
      </div>
    </div>
  )
}

export default Hero