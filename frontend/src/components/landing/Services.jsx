import styles from '../../styles/components/services.module.css'

const Services = () => {
  const services = [
    {
      title: "Security Guards",
      description: "Professional security personnel for your premises",
      icon: "🛡️"
    },
    {
      title: "Event Security",
      description: "Specialized security for events and gatherings",
      icon: "👥"
    },
    {
      title: "Residential Security",
      description: "24/7 protection for residential properties",
      icon: "🏠"
    },
    {
      title: "Corporate Security",
      description: "Comprehensive security solutions for businesses",
      icon: "🏢"
    }
  ]

  return (
    <section className={styles.services} id="services">
      <h2>Our Services</h2>
      <div className={styles.serviceGrid}>
        {services.map((service, index) => (
          <div key={index} className={styles.serviceCard}>
            <div className={styles.icon}>{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Services