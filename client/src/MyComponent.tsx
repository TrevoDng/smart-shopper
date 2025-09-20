// Example usage in any component
import { useSlider } from './slider/slidercontext/SliderContext';

const MyComponent: React.FC = () => {
  const { showSlider, hideSlider, toggleSlider, isSliderVisible } = useSlider();
  
  return (
    <div>
      <button onClick={showSlider}>Show Slider</button>
      <button onClick={hideSlider}>Hide Slider</button>
      <button onClick={toggleSlider}>Toggle Slider</button>
      <p>Slider is currently: {isSliderVisible ? 'Visible' : 'Hidden'}</p>
    </div>
  );
}

export default MyComponent;
