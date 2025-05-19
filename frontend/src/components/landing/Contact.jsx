import styles from '../../styles/components/contact.module.css'

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form[0].value;
    const email = form[1].value;
    const subject = form[2].value;
    const message = form[3].value;
    const whatsappMessage = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`;
    const whatsappUrl = `https://wa.me/917384860637?text=${encodeURIComponent(whatsappMessage)}`;
    window.location.href = whatsappUrl;
  }

  return (
    <section className={styles.contact} id="contact">
      <div className={styles.container}>
        <h2>Contact Us</h2>
        <div className={styles.content}>
          <div className={styles.info}>
            <h3>Get in Touch</h3>
            <p>Have questions about our security services? We're here to help!</p>
            <div className={styles.contactInfo}>
              <div>
                <strong>Address:</strong>
                <p>123 Security Street, City, State 12345</p>
              </div>
              <div>
                <strong>Phone:</strong>
                <p>+1 (555) 123-4567</p>
              </div>
              <div>
                <strong>Email:</strong>
                <p>info@ssibservice.com</p>
              </div>
            </div>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className={styles.formGroup}>
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className={styles.formGroup}>
              <input type="text" placeholder="Subject" required />
            </div>
            <div className={styles.formGroup}>
              <textarea placeholder="Your Message" rows="5" required></textarea>
            </div>
            <button type="submit" className={styles.submitBtn}>Send Message</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact