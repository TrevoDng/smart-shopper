import React, { createContext, useContext, useState } from 'react';

interface SliderContextType {
	isSliderVisible: boolean;
	setIsSliderVisible: React.Dispatch<React.SetStateAction<boolean>>;
	hideSlider: () => void;
	showSlider: () => void;
	toggleSlider: () => void;
}

const SliderContext = createContext<SliderContextType | undefined>(undefined);

interface SliderProviderProps {
	children: React.ReactNode;
	defaultVisible?: boolean;
}

export const SliderProvider: React.FC<SliderProviderProps> = ({
	children, 
	defaultVisible = true
}) => {
	const [isSliderVisible, setIsSliderVisible] = useState(defaultVisible);

	const hideSlider =()=> setIsSliderVisible(false);
	const showSlider =()=> setIsSliderVisible(true);
	const toggleSlider =()=> setIsSliderVisible(prev => !prev);

	const value: SliderContextType  = {
		isSliderVisible,
		setIsSliderVisible,
		hideSlider,
		showSlider,
		toggleSlider,
	};

	return (
		<SliderContext.Provider value={value}>
			{children}
		</SliderContext.Provider>
	);
};

export const useSlider=()=> {
	const context = useContext(SliderContext);

	if (context == undefined) {
		throw new Error ("useSlider must be used with SliderContext");
	} 

	return context;
}
