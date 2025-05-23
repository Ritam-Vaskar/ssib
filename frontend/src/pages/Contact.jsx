import { useState } from 'react';
import styles from '../styles/pages/contact.module.css';
import Contact from '../components/landing/Contact';

const ContactPage = () => {
  

  return (
    <div className={styles.contactPage}>
      <section className={styles.hero}>
        <h1>Contact Us</h1>
        <p>We're here to help and answer any questions you might have</p>
      </section>

      <div className={styles.container}>
        <section className={styles.contactInfo}>
          <div className={styles.infoCard}>
            <div className={styles.icon}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3>Our Office</h3>
            <p>123 Security Street</p>
            <p>City, State 12345</p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.icon}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3>Phone</h3>
            <p>+1 (555) 123-4567</p>
            <p>Mon-Fri 9am-6pm</p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.icon}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3>Email</h3>
            <p>info@ssibservice.com</p>
            <p>24/7 Support</p>
          </div>
          
        </section>
        <Contact/>
        <section className={styles.contactForm}>
          
        </section>

        <section className={styles.map}>
          <h2>Find Us</h2>
          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.1661841317767!2d88.42699661495993!3d22.576377385181697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275927b0061ad%3A0x496c2fab98874c86!2sCalcutta%20Institute%20of%20Engineering%20and%20Management!5e0!3m2!1sen!2sin!4v1679299507191!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>

        <section className={styles.faq}>
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h3>What services do you offer?</h3>
              <p>We offer a comprehensive range of security services including physical security, surveillance systems, and security consulting.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>How can I request a quote?</h3>
              <p>You can request a quote by filling out our contact form above or calling us directly at +1 (555) 123-4567.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Do you provide 24/7 service?</h3>
              <p>Yes, we provide round-the-clock security services and support to ensure your safety at all times.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;