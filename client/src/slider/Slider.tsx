import React, { useState, useEffect, useRef } from 'react';
import './slider.css';

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
      src: "https://firebasestorage.googleapis.com/v0/b/sa-telecoms-world-wide-d43a4.appspot.com/o/Clothes%2FScreenshot_20250704_125326.jpg?alt=media&token=736b05be-41f6-424c-94b1-59954488dc19",
      alt: "Image 1",
      category: "CLOTHES"
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/sa-telecoms-world-wide-d43a4.appspot.com/o/Clothes%2Fappliances_images_width_1080_height_1068_with.jpeg?alt=media&token=1d84aba8-c0c2-4676-b074-7063736402fd",
      alt: "Image 2",
      category: "APPLIANCES"
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/sa-telecoms-world-wide-d43a4.appspot.com/o/Clothes%2F1080_height_1068_with_blue.jpeg?alt=media&token=858e14f1-eb9f-4434-87c1-2be46bc5ed57",
      alt: "Image 3",
      category: "COMPUTERS"
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
    <div className="slider" data-page-id="top-slide-design">
      <h4 className={`item-type-text ${animate ? 'text-fade' : ''}`}>
        {slides[currentSlide]?.category || ''}
      </h4>
      <div className="slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide, index) => (
          <img key={index} src={slide.src} alt={slide.alt} />
        ))}
      </div>
      <div className="navigation">
        <button onClick={() => { prevSlide(); handleAutoSlideInteract(); }}>&#10094;</button>
        <button onClick={() => { nextSlide(); handleAutoSlideInteract(); }}>&#10095;</button>
      </div>
    </div>
  );
};

export default Slider;
