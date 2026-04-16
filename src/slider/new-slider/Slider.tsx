import React, { useState, useEffect, useRef } from 'react';
import './Slider.css';

interface Slide {
  src: string;
  alt: string;
  category: string;
}

const Slider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [animate, setAnimate] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slides: Slide[] = [
    {
      src: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
      alt: "Laptop on a table",
      category: "Laptops"
    },
    {
      src: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=400&h=300&fit=crop",
      alt: "Computer screen setup",
      category: "Computer Screen"
    },
    {
      src: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=400&h=300&fit=crop",
      alt: "Desktop computer",
      category: "Desktop"
    }
  ];

  const nextSlide = (): void => {
    setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (): void => {
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleAutoSlideInteract = (): void => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(nextSlide, 5000);
  };

  useEffect(() => {
    const intervalId = setInterval(nextSlide, 5000);
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 4500);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentSlide]);

  return (
    <div className="slider-section">
      <div className="slider-content">
        <div className="slider-title">
          <h1>Shop with purpose. Connect with trust.</h1>
          <p>
            Welcome to Aisle-Net - Where Trevor Netshisaulu brings 
            you a world of products through the power of connection.
          </p>
        </div>

        <div className="slider-card">

            <div className='slider-card-border'>
              <div className='inner-slider-card-border'></div>
              </div>
          <div className="slider-wrapper">
            <span className={`category-badge ${animate ? 'fade' : ''}`}>
              {slides[currentSlide]?.category}
            </span>

            <div
              className="slides-container"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <img
                  key={index}
                  src={slide.src}
                  alt={slide.alt}
                  className="slide-image"
                />
              ))}
            </div>

            <button
              className="nav-arrow prev"
              onClick={() => {
                prevSlide();
                handleAutoSlideInteract();
              }}
              aria-label="Previous slide"
            >
              &#10094;
            </button>
            <button
              className="nav-arrow next"
              onClick={() => {
                nextSlide();
                handleAutoSlideInteract();
              }}
              aria-label="Next slide"
            >
              &#10095;
            </button>

            <div className="dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentSlide(index);
                    handleAutoSlideInteract();
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;