import React, { useState, createContext } from 'react';
//import './App.css';
import ItemsMainComponent from './itemsComponents/itemsComponentContainer/ItemsMainComponent';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from './home/home';
//import MyComponent from './MyComponent';
import MyComponent from './MyComponent';
import Navbar from './nav/Navbar';
import SearchForm from './search/Search';
import Slider from './slider/Slider';
import { SliderProvider, useSlider } from './slider/slidercontext/SliderContext';
import PageNotFound from './pagenotfound/pagenotfound';
import './search/search.css';

const SliderConditionalRenderer: React.FC = () => {
	const { isSliderVisible } = useSlider();
	return isSliderVisible ? <Slider /> : null;
}

function AppComponent() {
	const [selectedType, setSelectedType] = useState<string | null>(null);

	const handleSelectedType = (type: string | null) => {
		setSelectedType(type);
	}

  return (
    	<BrowserRouter>
		<Navbar onSelectedType={handleSelectedType} selectedType={selectedType} />
		<SearchForm />
		<MyComponent />
		<SliderConditionalRenderer />	
		<Routes> = setTime
		<Route path="/" element={<Home />} />
		<Route path="/items" element={<ItemsMainComponent />} />
		<Route path="*" element={<PageNotFound />} />
		</Routes>
	</BrowserRouter>
  );
}

const App: React.FC = () => {
	return (
		<SliderProvider defaultVisible={true}>
			<AppComponent />
		</SliderProvider>
	)
}

export default App;