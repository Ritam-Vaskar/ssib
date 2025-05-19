import { useState, useEffect } from 'react';
import styles from '../../styles/components/gallery.module.css';

const Gallery = () => {
  const images = [
    {
      url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      alt: 'Security guard at entrance',
      caption: 'Professional security at corporate entrances'
    },
    {
      url: 'https://images.unsplash.com/photo-1551818014-7c8ace9c1b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      alt: 'Event security',
      caption: 'Specialized event security services'
    },
    {
      url: 'https://images.unsplash.com/photo-1557318041-1ce374d55ebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      alt: 'Residential security',
      caption: 'Residential security solutions'
    },
    {
      url: 'https://images.unsplash.com/photo-1581093458791-9d09c85a2a3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      alt: 'Security monitoring',
      caption: 'Advanced security monitoring systems'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.gallery} id="gallery">
      <div className={styles.container}>
        <h2>Our Gallery</h2>
        <p className={styles.subtitle}>See our security professionals in action</p>
        
        <div className={styles.carousel}>
          <button className={`${styles.carouselBtn} ${styles.prevBtn}`} onClick={prevSlide}>
            &lt;
          </button>
          
          <div className={styles.carouselContent}>
            {images.map((image, index) => (
              <div 
                key={index} 
                className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
                style={{ transform: `translateX(${100 * (index - currentIndex)}%)` }}
              >
                <img src={image.url} alt={image.alt} />
                <div className={styles.caption}>
                  <p>{image.caption}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className={`${styles.carouselBtn} ${styles.nextBtn}`} onClick={nextSlide}>
            &gt;
          </button>
        </div>
        

      </div>
    </section>
  );
};

export default Gallery;