import { useEffect, useRef, useState } from 'react';

export const useContainerOverflow=()=> {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasOverflow, setHasOverflow] = useState(false);

    const checkOverflow=()=> {
        const container = containerRef.current;

        if(!container) return;

        const cards = container.querySelectorAll('.item');
        //alert(cards.length);

        if(cards.length === 0) return;

        const totalWidth = Array.from(cards).reduce((total, card)=> {
            return total + card.getBoundingClientRect().width;
        }, 0);

        setHasOverflow(totalWidth > container.clientWidth);
    }

    useEffect(()=> {
        checkOverflow();

        const observer = new ResizeObserver(checkOverflow);
        if(containerRef.current) {
            observer.observe(containerRef.current);
        }
        return observer.disconnect();
    }, []);

    return { containerRef, hasOverflow, checkOverflow };

}