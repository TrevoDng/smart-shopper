import React from "react"

export const handleDescriptionHeight=(
    e: React.MouseEvent,
    heightRef: React.RefObject<HTMLDivElement> | null,
    isExpand: boolean,
    setIsExpand: React.Dispatch<React.SetStateAction<boolean>>,
    closeOtherDropDown: ()=> void,
   // func: (e: React.MouseEvent)=> void,
): void=> {

    e.preventDefault();
    //func(e);

    const element = heightRef?.current;

    if (!element) return;

    closeOtherDropDown();

    if (isExpand) {
        element.style.height = "0px";
    } else {
        element.style.height = `${element.scrollHeight}px`; 
    }
    setIsExpand(!isExpand);
}