import styles from '../../styles/components/hero.module.css'

const Hero = () => {
  return (
    <div className={styles.hero} id="home">
      <div className={styles.content}>
        <h1>Professional Security Services</h1>
        <p>Protecting what matters most with trusted, reliable and comprehensive security solutions for businesses and individuals</p>
        <div className={styles.cta}>
          <button className={styles.primaryBtn}>Get Started</button>
          <button className={styles.secondaryBtn}>Learn More</button>
        </div>
      </div>
    </div>
  )
}

export default Hero