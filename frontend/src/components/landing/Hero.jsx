import styles from '../../styles/components/hero.module.css'

const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <h1>Professional Security Services</h1>
        <p>Protecting what matters most with trusted security solutions</p>
        <div className={styles.cta}>
          <button className={styles.primaryBtn}>Get Started</button>
          <button className={styles.secondaryBtn}>Learn More</button>
        </div>
      </div>
    </div>
  )
}

export default Hero