import React,{ useEffect, useState, useRef } from 'react';
//import { BrowserRouter, Routes, Route } from 'react-router-dom';


import './nav.css';

interface NavbarProps {
  onSelectedType: (type: string | null) => void;
  selectedType: string | null;
}

const handleElHeight=(e: React.MouseEvent, 
  heightRef: React.RefObject<HTMLLIElement>, 
  isExpand: boolean, 
  setIsExpand: React.Dispatch<React.SetStateAction<boolean>>, 
  func: (e: React.MouseEvent) => void
): void => {
    e.preventDefault();
    func(e);
    
const element = heightRef.current;

    if (!element) return;

    if(element.style.height && element.style.height !== '0px') {
        element.style.height = '0px';
        setIsExpand(!isExpand);
        return;
    }
  } 

const Navbar: React.FC<NavbarProps> = ({
  onSelectedType, 
  selectedType
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  
  const [isCategExpand, setIsCategExpand] = useState(false);
  const [isAccExpand, setIsAccExpand] = useState(false);
  const categoryRef = useRef<HTMLLIElement>(null);
  const accountRef = useRef<HTMLLIElement>(null);
  const [isCategRotate, setIsCategRotate] = useState(false);
  const [isAccRotate, setIsAccRotate] = useState(false);
  const categoryIconRef = useRef<HTMLSpanElement>(null);
  const accountIconRef = useRef<HTMLSpanElement>(null);

  const toggleMenu = (): void => {
    setMenuOpen(!menuOpen);
  };


  useEffect(() => {
    const handleResize = (): void => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    
    const handleClickOutside = (event: MouseEvent): void => {
      if (menuOpen && 
          menuRef.current && 
          buttonRef.current &&
          !menuRef.current.contains(event.target as Node) && 
          !buttonRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    // Add event listener when menu is open
    if (menuOpen) {
      document.addEventListener('click', handleClickOutside as EventListener);
    }

    // Cleanup function
    return () => {
    window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside as EventListener);
    };
    
  }, [menuOpen]);
  
  const handleCategRotate =(e: React.MouseEvent): void => {
      e.preventDefault();
      
      const categoryIconEl =  categoryIconRef.current;
      
    if(categoryIconEl) {
        categoryIconEl.style.transform = isCategRotate ? 'rotate(0deg)' : 'rotate(45deg)';
    setIsCategRotate(!isCategRotate);
    setIsAccRotate(isAccRotate);
    }
  }
  
  const handleAccRotate =(e: React.MouseEvent): void => {
      e.preventDefault();
      const accountIconEl =  accountIconRef.current;
    
    if(accountIconEl) {
        accountIconEl.style.transform = isAccRotate ? 'rotate(0deg)' : 'rotate(45deg)';
    setIsAccRotate(!isAccRotate);
    }
  }
  
  const showType =(e: React.MouseEvent, type: string): void => {
      e.preventDefault();
      onSelectedType(selectedType === type ? null : type);
      console.log(selectedType)
  }
  
  return (
    <nav className="nav-bar">
      <div 
        className="menu-btn-container"
        id="menu-bar-container"
        style={{ fontSize: "20px", cursor: "pointer" }}
        ref={buttonRef}
      > 
        <i 
          className="fa-solid fa-bars open-close-menu-btn"
          onClick={toggleMenu}
          id="icon"
        ></i>
      </div>

      <div
        id="nav-container"
        style={{ color: '#000', padding: '5px', width: '100%' }}
      >
        <h2 className="website-name">
          <a href="#" className="website-name-link">
            SMART <i className="fa-solid fa-bag-shopping"></i> SHOPPER
          </a>
        </h2>
      </div>

      <div
        className="div-menu-container"
        id="div-menu-container"
        ref={menuRef}
        style={{
          width: menuOpen ? "250px" : "0px",
          display: window.innerWidth >= 768 ? "none" : "block"
        }}
      >
        <div className="close-side-menu-icon">
          <i
            className="fa-solid fa-arrow-right"
            id="side-menu-icon"
            onClick={toggleMenu}
          ></i>
        </div>

        <ul id="menu-list">
          <li><a href="#">HOME</a></li>
          <li onClick={(e: React.MouseEvent) => handleElHeight(e, categoryRef as React.RefObject<HTMLLIElement>, 
            isCategExpand, setIsCategExpand, () => handleCategRotate(e))}>
            <a href="#" id="menu-categories-btn" className="menu-categories-btn" 
            >
              CATEGORIES <span ref={categoryIconRef} className="category-icon"><i className="fa-solid fa-plus"></i></span>
            </a>
            <ul id="categories-content">
              <li onClick={(e)=> showType(e, 'laptops')}>
                <a href="#laptops" className="type-link" data-page-id="laptops" 
                >
                  Laptops
                </a>
              </li>
              <li>
                <a href="#desktop" className="type-link" data-page-id="desktop" 
                onClick={(e)=> showType(e, 'desktop')}>
                  Desktops
                </a>
              </li>
              <li>
                <a href="#screens" className="type-link" data-page-id="screens" 
                onClick={(e)=> showType(e, 'screens')}>
                  Computer Screens
                </a>
              </li>
            </ul>
          </li>
          <li onClick={(e)=> handleElHeight(e, accountRef as React.RefObject<HTMLLIElement>, 
          isAccExpand, setIsAccExpand, handleAccRotate)}>
            <a href="#" id="menu-account-btn" className="menu-account-btn">
              PROFILE <span ref={accountIconRef} className="account-icon">
                <i className="fa-solid fa-plus"></i></span>
            </a>
            <ul id="account-content">
              <li><a href="#">Login</a></li>
              <li><a href="#">Register</a></li>
              <li><a href="#">My Account</a></li>
            </ul>
          </li>
          <li><a href="#">CART</a></li>
          <li><a href="#">CHECKOUT</a></li>
        </ul>
      </div>
    </nav>

  );
};

      export default Navbar;
