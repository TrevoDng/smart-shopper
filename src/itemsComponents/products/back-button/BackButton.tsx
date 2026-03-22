import React from "react";
import { useNavigate } from "react-router-dom";
import { useSlider } from "../../../slider/slidercontext/SliderContext";
//import './BackButton.css';

interface BackButtonProps {
    onSelectedType: (type: string | null)=> void; 
    selectedType: string | null;
    onTypeById: (id: number | null)=> void; 
    onItemId: (id: string | null)=> void; 
    selectedItemId: string | null;
    onShowCart: (show: boolean)=> void;
    showCart: boolean;
}

// show all items
export const BackButton: React.FC<BackButtonProps>=({
    onSelectedType, 
    selectedType, 
    onTypeById, 
    onItemId, 
    selectedItemId, 
    onShowCart, 
    showCart
})=> {

  const navigate = useNavigate();
  const {showSlider} = useSlider();
        

  const handleGoBack=(e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
    
        navigate(-1);
        /*
    if (selectedType && !selectedItemId) {
      onSelectedType(null);
      onTypeById(null);
    }
    
    if (selectedItemId && !selectedType) {
      onItemId(null);
      onTypeById(null);
      navigate('/');
    }
    
    if (selectedType && selectedItemId) {
      onItemId(null);
      document.querySelector(".items-container")?.classList.add("column-alignment");
    }
    
    if (showCart) {
      onShowCart(!showCart);
    }

    if(navigate('/cart') && selectedItemId) {
      onItemId(null);
      navigate('/cart');
    }

    if(navigate('/cart') && !selectedItemId) {
      navigate('/');
    }
    */
        
    }

    return (
        <div id="leave-item-data-container">
          <button 
            className="leave-item-data-btn" 
            id="leave-item-data" 
            style={{
              background:"none", 
              border:"2px solid #d8d8d8ff", 
              borderRadius:"20px",
              margin:"50px",
              padding:"10px 20px",
              color:"#006effff",
              fontSize:"30px",
              cursor:"pointer"}}
            onClick={(e)=> handleGoBack(e)}
          >
            {
          <i className="fa-solid fa-arrow-left" 
              style={{fontSize:"none"}}></i>} 
          </button>
        </div>
    )
}