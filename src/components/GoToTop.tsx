import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const GoToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled up to given distance
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the scroll event listener
    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed left-4 bottom-4 z-50 p-3 rounded-full 
                    bg-blue-600 text-white 
                    border-2 border-white
                    shadow-[0_0_15px_rgba(0,0,0,0.2)]
                    hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]
                    transition-all duration-300 
                    hover:scale-110"
                    aria-label="Go to top"
                >
                    <ArrowUp className="h-6 w-6" />
                </button>
            )}
        </>
    );
};

export default GoToTop;