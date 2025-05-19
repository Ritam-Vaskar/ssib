import { useState } from 'react';
import styles from '../../styles/components/testimonials.module.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'John Smith',
      role: 'Business Owner',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      text: 'The security services provided by SSIB have been exceptional. Their guards are professional, vigilant, and always punctual. I feel much safer knowing my business is protected by their team.',
      rating: 5
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Event Manager',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      text: 'We hired SSIB for our corporate event, and they exceeded our expectations. Their team was discreet yet effective, ensuring everything ran smoothly without any security concerns.',
      rating: 5
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Residential Complex Manager',
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      text: 'Our residential community has seen a significant decrease in security incidents since partnering with SSIB. Their guards are friendly with residents while maintaining professional vigilance.',
      rating: 4
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      role: 'School Administrator',
      image: 'https://randomuser.me/api/portraits/women/28.jpg',
      text: 'The peace of mind that comes with having SSIB security at our school is invaluable. Parents and staff alike feel safer with their presence.',
      rating: 5
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>★</span>
    ));
  };

  return (
    <section className={styles.testimonials} id="testimonials">
      <div className={styles.container}>
        <h2>What Our Clients Say</h2>
        <p className={styles.subtitle}>Trusted by businesses and individuals across the country</p>
        
        <div className={styles.testimonialSlider}>
          <button 
            className={`${styles.sliderBtn} ${styles.prevBtn}`} 
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
          >
            &lt;
          </button>
          
          <div className={styles.testimonialWrapper}>
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className={`${styles.testimonialCard} ${index === activeIndex ? styles.active : ''}`}
                style={{ transform: `translateX(${100 * (index - activeIndex)}%)` }}
                aria-hidden={index !== activeIndex}
              >
                <div className={styles.testimonialContent}>
                  <div className={styles.testimonialHeader}>
                    <img 
                      src={testimonial.image} 
                      alt={`${testimonial.name}`} 
                      className={styles.testimonialImage} 
                    />
                    <div>
                      <h3>{testimonial.name}</h3>
                      <p className={styles.role}>{testimonial.role}</p>
                      <div className={styles.rating}>
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                  </div>
                  <p className={styles.testimonialText}>"{testimonial.text}"</p>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className={`${styles.sliderBtn} ${styles.nextBtn}`} 
            onClick={nextTestimonial}
            aria-label="Next testimonial"
          >
            &gt;
          </button>
        </div>
        

      </div>
    </section>
  );
};

export default Testimonials;