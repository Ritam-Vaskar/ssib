import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import styles from '../styles/pages/about.module.css'

const About = () => {
  return (
    <div>
      {/* <Navbar /> */}
      <div className={styles.aboutContainer}>
        <div className={styles.aboutHero}>
          <h1>About SSIB Service</h1>
          <p>Your Trusted Partner in Security Solutions</p>
        </div>
        
        <section className={styles.aboutContent}>
          <div className={styles.missionSection}>
            <h2>Our Mission</h2>
            <p>To provide professional and reliable security services that ensure the safety and peace of mind of our clients through innovative solutions and exceptional service.</p>
          </div>
          
          <div className={styles.valuesSection}>
            <h2>Our Values</h2>
            <div className={styles.valueGrid}>
              <div className={styles.valueCard}>
                <h3>Integrity</h3>
                <p>We maintain the highest standards of professional ethics and honesty.</p>
              </div>
              <div className={styles.valueCard}>
                <h3>Excellence</h3>
                <p>We strive for excellence in every aspect of our service delivery.</p>
              </div>
              <div className={styles.valueCard}>
                <h3>Reliability</h3>
                <p>We are committed to being dependable and consistent in our service.</p>
              </div>
              <div className={styles.valueCard}>
                <h3>Innovation</h3>
                <p>We continuously adapt and improve our security solutions.</p>
              </div>
            </div>
          </div>
          
          <div className={styles.teamSection}>
            <h2>Our Team</h2>
            <p>Our team consists of highly trained security professionals with extensive experience in various security domains. Each member is carefully selected and undergoes rigorous training to ensure the highest level of service.</p>
          </div>
        </section>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default About