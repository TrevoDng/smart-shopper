import { useEffect, useRef, useState } from "react";

import './ImagePopup.css';
import { getFullImageUrl } from "../utils/getFullImageUrl";

interface ImagePopupProps {
    images: string[];
    onClose: ()=> void;
}

const ImagePopup: React.FC<ImagePopupProps>=({
    images,
    onClose
})=> {

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [buttonsVisible, setButtonsVisible] = useState<boolean>(true);
    const imgContainerRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Navigate to next image
  const nextImage = () => {
    setCurrentIndex((prevIndex: number) => (prevIndex + 1) % images.length);
  };

  // Navigate to previous image
  const prevImage = () => {
    setCurrentIndex((prevIndex: number) => (prevIndex - 1 + images.length) % images.length);
  };

  // Handle swipe for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touchStartX = e.changedTouches[0].screenX;

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].screenX;
      const threshold = 50;
      
      if (touchEndX < touchStartX - threshold) {
        nextImage();
      }
      
      if (touchEndX > touchStartX + threshold) {
        prevImage();
      }
    };

    if(imgContainerRef.current) {
        imgContainerRef.current.addEventListener('touchend', handleTouchEnd, { once: true });
    }
};

  // Toggle buttons visibility
  const toggleButtons = () => {
    setButtonsVisible(prev => !prev);
  };

    return (
        <div className="popup-container popup-active" ref={popupRef}>
      {buttonsVisible && (
        <> {images.length > 1 &&
          <button className="popup-btn previous-popup-img-btn" onClick={prevImage}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
            }
          
          <span className="popup-btn popup-img-index">
            {currentIndex + 1}/{images.length}
          </span>
       {images.length > 1 &&   
          <button className="popup-btn next-popup-img-btn" onClick={nextImage}>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
      }
        </>
      )}
      
      <button 
        className="popup-btn cancel-popup-img-btn" 
        onClick={onClose}
        style={{ display: buttonsVisible ? 'block' : 'block' }}
      >
        <i className="fa-solid fa-xmark"></i>
      </button>
      
      <div 
        className="popup-img-container" 
        ref={imgContainerRef}
        onClick={toggleButtons}
        onTouchStart={handleTouchStart}
      >
        {images.map((src, index) => (
          <img
            key={`${src}-${index}`}  // Combine src and index to ensure uniqueness
            src={getFullImageUrl(src) || src} // Fallback to original src if getFullImageUrl returns empty
            className={`popup-img ${
              index === currentIndex ? 'active' :
              index === (currentIndex + 1) % images.length ? 'next' :
              index === (currentIndex - 1 + images.length) % images.length ? 'prev' :
              'hidden'
            }`}
            alt={`Product view ${index + 1}`}
          />
        ))}
      </div>
    </div>
    )
}

export default ImagePopup;