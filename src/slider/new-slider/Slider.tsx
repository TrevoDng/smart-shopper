// src/slider/new-slider/Slider.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Slider.css';

interface Slide {
  src: string;
  alt: string;
  category: string;
}

const Slider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [animate, setAnimate] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slides: Slide[] = [
    {
      src: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=500&fit=crop", //"https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=500&fit=crop",
      alt: "Laptop on a table",
      category: "Laptops"
    },
    {
      src: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=300&fit=crop",
      alt: "Computer screen setup",
      category: "Monitors"
    },
    {
      src: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=500&fit=crop",
      alt: "Desktop computer",
      category: "Desktop"
    }
  ];

  const nextSlide = useCallback((): void => {
    setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback((): void => {
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const resetAutoSlideTimer = useCallback((): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, 5000);
  }, [nextSlide]);

  const handleManualNavigation = useCallback((callback: () => void): void => {
    callback();
    resetAutoSlideTimer();
  }, [resetAutoSlideTimer]);

  // Set up auto-slide interval
  useEffect(() => {
    // Start the interval for auto-sliding
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
    
    // Set initial animation
    setAnimate(true);
    animateTimeoutRef.current = setTimeout(() => setAnimate(false), 4500);
    
    // Set initial timeout for reset (though interval handles it)
    resetAutoSlideTimer();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (animateTimeoutRef.current) {
        clearTimeout(animateTimeoutRef.current);
      }
    };
  }, [nextSlide, resetAutoSlideTimer]);

  // Handle animation on slide change
  useEffect(() => {
    setAnimate(true);
    if (animateTimeoutRef.current) {
      clearTimeout(animateTimeoutRef.current);
    }
    animateTimeoutRef.current = setTimeout(() => setAnimate(false), 4500);
  }, [currentSlide]);

  return (
    <div className="slider-section">
      <div className="slider-content">
        <div className="slider-title">
          <h1>Everything You Need, Delivered with a Smile.</h1>
          {/* <h1>Shop with purpose. Connect with trust.</h1>*/ }
          <p>
            Welcome to Eisle-Net - Where we bring you 
            a world of products through the power of connection.
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
                  loading="lazy"
                />
              ))}
            </div>

            <button
              className="nav-arrow prev"
              onClick={() => handleManualNavigation(prevSlide)}
              aria-label="Previous slide"
            >
              &#10094;
            </button>
            
            <button
              className="nav-arrow next"
              onClick={() => handleManualNavigation(nextSlide)}
              aria-label="Next slide"
            >
              &#10095;
            </button>

            <div className="dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => handleManualNavigation(() => setCurrentSlide(index))}
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

/*
// src/slider/new-slider/Slider.tsx
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
*/