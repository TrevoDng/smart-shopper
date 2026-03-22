import { useNavigate } from "react-router-dom";
import { useSlider } from "../../../slider/slidercontext/SliderContext";

const Deals: React.FC=()=> {
    const navigate = useNavigate();
    const {hideSlider} = useSlider();
             //hide slider
                 hideSlider();
    
    const returnHome=()=> {
        navigate('/');    
    }
    return (
            <div className="max-w-4xl mx-auto px-4 py-8 empty-cart-message">
                <div className="text-center py-16">
                    <i className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Deals list is currently empty</h2>
                    <p className="text-gray-600 mb-6">Start Shopping items you love!</p>
                    <a
                        href="/"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <i className="mr-2" />
                        Continue Shopping
                    </a>
                </div>
            </div>
        )
}

export default Deals;