import React,{ useEffect, useState, useRef } from 'react';
import './nav.css';
import { getFilteredProducts } from '../itemsComponents/products/category-filter/filteredProducts';
import { ProductCategory } from '../itemsComponents/products/types/Product';

interface NavbarProps {
  datas: ProductCategory[];
  onSelectedType: (type: string | null) => void;
  selectedType: string | null;
}

const topIcons = [
  {
    iconClass:'fas fa-search item-cart-icon'
  },
  {
    iconClass:'fas fa-user item-cart-icon'
  },
  {
    iconClass: 'fa-regular fa-heart item-heart-icon'
  },
  {
    iconClass:'fas fa-shopping-cart item-cart-icon'
  }
];

const handleElHeight = (
  e: React.MouseEvent, 
  heightRef: React.RefObject<HTMLUListElement>, 
  isExpand: boolean, 
  setIsExpand: React.Dispatch<React.SetStateAction<boolean>>,
  closeOtherDropdown: () => void, // Function to close the other dropdown
  func: (e: React.MouseEvent) => void
): void => {
  e.preventDefault();
  func(e);
  
  const element = heightRef.current;
  if (!element) return;

  // Close the other dropdown first
  closeOtherDropdown();

  // Toggle current dropdown
  if (isExpand) {
    element.style.height = '0px';
  } else {
    element.style.height = element.scrollHeight + 'px';
  }
  
  setIsExpand(!isExpand);
} 

const Navbar: React.FC<NavbarProps> = ({
  datas,
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
  const categoryRef = useRef<HTMLUListElement>(null);
  const accountRef = useRef<HTMLUListElement>(null);
  const [isCategRotate, setIsCategRotate] = useState(false);
  const [isAccRotate, setIsAccRotate] = useState(false);
  const categoryIconRef = useRef<HTMLSpanElement>(null);
  const accountIconRef = useRef<HTMLSpanElement>(null);

  const toggleMenu = (): void => {
    setMenuOpen(!menuOpen);
  };

  // Functions to close the other dropdown
  const closeAccountDropdown = (): void => {
    if (isAccExpand && accountRef.current) {
      accountRef.current.style.height = '0px';
      setIsAccExpand(false);
      if (accountIconRef.current) {
        accountIconRef.current.style.transform = 'rotate(0deg)';
        setIsAccRotate(false);
      }
    }
  };

  const closeCategoryDropdown = (): void => {
    if (isCategExpand && categoryRef.current) {
      categoryRef.current.style.height = '0px';
      setIsCategExpand(false);
      if (categoryIconRef.current) {
        categoryIconRef.current.style.transform = 'rotate(0deg)';
        setIsCategRotate(false);
      }
    }
  };

  useEffect(() => {
    const handleResize = (): void => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleClickOutside = (event: MouseEvent): void => {
      if (menuOpen && 
          menuRef.current && 
          buttonRef.current &&
          !menuRef.current.contains(event.target as Node) && 
          !buttonRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('click', handleClickOutside as EventListener);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside as EventListener);
    };
  }, [menuOpen]);
  
  const handleCategRotate = (e: React.MouseEvent): void => {
    e.preventDefault();
    const categoryIconEl = categoryIconRef.current;
    
    if(categoryIconEl) {
      categoryIconEl.style.transform = isCategRotate ? 'rotate(0deg)' : 'rotate(45deg)';
      setIsCategRotate(!isCategRotate);
    }
  }
  
  const handleAccRotate = (e: React.MouseEvent): void => {
    e.preventDefault();
    const accountIconEl = accountIconRef.current;
    
    if(accountIconEl) {
      accountIconEl.style.transform = isAccRotate ? 'rotate(0deg)' : 'rotate(45deg)';
      setIsAccRotate(!isAccRotate);
    }
  }
  
  const showType = (e: React.MouseEvent, type: string): void => {
    e.preventDefault();
    onSelectedType(selectedType === type ? null : type);
    console.log(selectedType)
  }

  const handleTypeClick=(type: string, e: React.MouseEvent<HTMLLIElement, MouseEvent>)=> {
    e.preventDefault();

    const category = getFilteredProducts(datas, type);

    const timer = setTimeout(()=> {
      onSelectedType(category.length > 0 ? type : null);
    }, 2000);

    return ()=> {
      clearTimeout(timer);
    }
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
            <span className='smart'>SMART</span> <i className="fa-solid fa-bag-shopping"></i> <span className='shopper'>SHOPPER</span>
          </a>
        </h2>
      </div>

      <div className='desktop-menu-container' id='desktop-menu-container'>
        <ul>
          {topIcons.map((item, index)=> (
                <>
                <li key={index} onClick={(e)=> handleTypeClick("item", e)}>
                  {<i className={item.iconClass}/>}
                  {/* {item.type.toUpperCase()} */}
                {/*<a href={item.type} className="type-link" data-page-id="laptops">
                  {item.type}
                </a>*/}
              </li>
                </>
              ))
              }
        </ul>
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
          <li onClick={(e: React.MouseEvent) => 
                handleElHeight(
                  e, 
                  categoryRef as React.RefObject<HTMLUListElement>, 
                  isCategExpand, 
                  setIsCategExpand,
                  closeAccountDropdown, // Close account when opening categories
                  handleCategRotate
                )
              }>
            <a 
              href="#" 
              id="menu-categories-btn" 
              className="menu-categories-btn"
              
            >
              CATEGORIES <span ref={categoryIconRef} className="category-icon"><i className="fa-solid fa-plus"></i></span>
            </a>
            <ul 
              id="categories-content"
              ref={categoryRef}
              style={{ height: '0px', overflow: 'hidden', transition: 'height 0.3s ease' }}
            >
              {datas.map((item, index)=> (
                <>
                <li key={item.typeId} onClick={(e)=> handleTypeClick(item.type, e)}>
                <a href={item.type} className="type-link" data-page-id="laptops">
                  {item.type}
                </a>
              </li>
                </>
              ))
              }
            </ul>
          </li>
          <li onClick={(e: React.MouseEvent) => 
                handleElHeight(
                  e, 
                  accountRef as React.RefObject<HTMLUListElement>, 
                  isAccExpand, 
                  setIsAccExpand,
                  closeCategoryDropdown, // Close categories when opening account
                  handleAccRotate
                )
              }>
            <a 
              href="#" 
              id="menu-account-btn" 
              className="menu-account-btn">
              PROFILE <span ref={accountIconRef} className="account-icon">
                <i className="fa-solid fa-plus"></i></span>
            </a>
            <ul 
              id="account-content"
              ref={accountRef}
              style={{ height: '0px', overflow: 'hidden', transition: 'height 0.3s ease' }}
            >
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