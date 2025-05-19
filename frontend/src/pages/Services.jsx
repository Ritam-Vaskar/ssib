import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import styles from '../styles/pages/services.module.css'
import { FaShieldAlt, FaUsers, FaHome, FaBuilding } from 'react-icons/fa'

const Services = () => {
  const services = [
    {
      title: "Security Guards",
      description: "Professional security personnel for your premises",
      features: [
        "24/7 trained security guards",
        "Uniformed and plain-clothes options",
        "Regular security reports",
        "Emergency response protocols"
      ],
      icon: <FaShieldAlt />
    },
    {
      title: "Event Security",
      description: "Comprehensive security for events and gatherings",
      features: [
        "Crowd control management",
        "VIP protection",
        "Access control systems",
        "Emergency evacuation planning"
      ],
      icon: <FaUsers />
    },
    {
      title: "Residential Security",
      description: "Complete protection for residential properties",
      features: [
        "Gated community security",
        "Patrol services",
        "CCTV monitoring",
        "Visitor management"
      ],
      icon: <FaHome />
    },
    {
      title: "Corporate Security",
      description: "Advanced security solutions for businesses",
      features: [
        "Access control systems",
        "Asset protection",
        "Emergency response",
        "Security consulting"
      ],
      icon: <FaBuilding />
    }
  ]

  return (
    <div>
      {/* <Navbar /> */}
      <div className={styles.servicesContainer}>
        <div className={styles.servicesHero}>
          <h1>Our Services</h1>
          <p>Professional Security Solutions for Every Need</p>
          <div className={styles.heroOverlay}></div>
        </div>
        
        <section className={styles.servicesContent}>
          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <div key={index} className={styles.serviceCard}>
                <div className={styles.serviceIconWrapper}>
                  <div className={styles.serviceIcon}>{service.icon}</div>
                </div>
                <h2>{service.title}</h2>
                <p className={styles.serviceDescription}>{service.description}</p>
                <ul className={styles.featuresList}>
                  {service.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                <button className={styles.inquireButton}>Inquire Now</button>
              </div>
            ))}
          </div>

          <div className={styles.whyChooseUs}>
            <h2>Why Choose SSIB Service?</h2>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitCard}>
                <h3>Professional Team</h3>
                <p>Highly trained and experienced security personnel</p>
              </div>
              <div className={styles.benefitCard}>
                <h3>24/7 Support</h3>
                <p>Round-the-clock assistance and monitoring</p>
              </div>
              <div className={styles.benefitCard}>
                <h3>Custom Solutions</h3>
                <p>Tailored security plans for your specific needs</p>
              </div>
              <div className={styles.benefitCard}>
                <h3>Modern Technology</h3>
                <p>Latest security equipment and systems</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default Services