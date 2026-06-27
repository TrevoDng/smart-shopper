import { createContext, useContext, useState } from "react";


interface MainCategoryTypes {
    setIscategoryVisible: React.Dispatch<React.SetStateAction<boolean>>;
    iscategoryVisible: boolean;
    hideMainCategory: ()=> void;
    showMainCategory: ()=> void;
    togleMainCategory: ()=> void;
}

const MaiCategoryFilterContext = createContext<MainCategoryTypes | undefined>(undefined);

interface MainCategoryProps {
    children: React.ReactNode;
    defaultVisible?: boolean;
}

export const MainCategoryProvider: React.FC<MainCategoryProps> =({
    children,
    defaultVisible = true
}) => {

    const [iscategoryVisible, setIscategoryVisible] = useState<boolean>(defaultVisible);

    const hideMainCategory =()=> setIscategoryVisible(false);
    const showMainCategory =()=> setIscategoryVisible(true);
    const togleMainCategory =()=> setIscategoryVisible(prev=> !prev);
    
    const value : MainCategoryTypes = {
        setIscategoryVisible,
        iscategoryVisible,
        hideMainCategory,
        showMainCategory,
        togleMainCategory 
    }

    return <MaiCategoryFilterContext.Provider value={value}>
        {children}
    </MaiCategoryFilterContext.Provider>   
}

export const useMainCategoryContext=()=> {
    const context = useContext(MaiCategoryFilterContext);
    if (context === undefined) {
        throw new Error ("useSlider must be used with SliderContext");
    } 
        
        return context;
}