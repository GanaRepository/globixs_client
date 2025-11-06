// 'use client';

// import React, { useRef, useEffect } from 'react';

// export interface InfiniteMovingCardsProps {
//   items: React.ReactNode;
//   direction?: 'left' | 'right';
//   speed?: number;
//   pauseOnHover?: boolean;
//   className?: string;
// }

// const InfiniteMovingCards: React.FC<InfiniteMovingCardsProps> = ({
//   items,
//   direction = 'left',
//   speed = 10,
//   pauseOnHover = true,
//   className = '',
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const scrollerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     // Early return if refs aren't available
//     if (!scrollerRef.current || !containerRef.current) return;

//     // Clone the scroller to ensure seamless looping
//     const scrollerContent = Array.from(scrollerRef.current.children);
//     scrollerContent.forEach((item) => {
//       const duplicatedItem = item.cloneNode(true);
//       scrollerRef.current?.appendChild(duplicatedItem);
//     });

//     // Calculate total width for animation calculation
//     const scrollerWidth = scrollerRef.current.offsetWidth;
//     const animationDuration = (scrollerWidth / speed) * 0.05; // Adjust factor for smoother animation

//     const directionValue = direction === 'left' ? 1 : -1;

//     // Set animation via CSS custom properties instead of inline styles
//     scrollerRef.current.style.setProperty(
//       '--duration',
//       `${animationDuration}s`
//     );
//     scrollerRef.current.style.setProperty(
//       '--direction',
//       directionValue.toString()
//     );

//     // Add the animation class
//     scrollerRef.current.classList.add('animate-scroll');

//     // Pause on hover functionality
//     const handleMouseEnter = () => {
//       if (pauseOnHover && scrollerRef.current) {
//         scrollerRef.current.style.animationPlayState = 'paused';
//       }
//     };

//     const handleMouseLeave = () => {
//       if (pauseOnHover && scrollerRef.current) {
//         scrollerRef.current.style.animationPlayState = 'running';
//       }
//     };

//     if (pauseOnHover) {
//       containerRef.current.addEventListener('mouseenter', handleMouseEnter);
//       containerRef.current.addEventListener('mouseleave', handleMouseLeave);
//     }

//     // Cleanup function
//     return () => {
//       if (pauseOnHover && containerRef.current) {
//         containerRef.current.removeEventListener(
//           'mouseenter',
//           handleMouseEnter
//         );
//         containerRef.current.removeEventListener(
//           'mouseleave',
//           handleMouseLeave
//         );
//       }
//     };
//   }, [speed, direction, pauseOnHover]); // Dependencies

//   return (
//     <div className={`relative w-full overflow-hidden ${className}`}>
//       {/* Gradient masks */}
//       <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
//       <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

//       {/* Main scroll container with ref */}
//       <div ref={containerRef} className="w-full overflow-hidden">
//         {/* Scroller element */}
//         <div
//           ref={scrollerRef}
//           className="flex gap-4 py-4 w-max"
//           style={{
//             willChange: 'transform',
//           }}
//         >
//           {items}
//           {/* Second set of items added dynamically in useEffect */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InfiniteMovingCards;

'use client';

import React, { useRef, useEffect } from 'react';

export interface InfiniteMovingCardsProps {
  items: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

const InfiniteMovingCards: React.FC<InfiniteMovingCardsProps> = ({
  items,
  direction = 'left',
  speed = 10,
  pauseOnHover = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Early return if refs aren't available
    if (!scrollerRef.current || !containerRef.current) return;

    // Get a reference to the current DOM node
    const currentContainerRef = containerRef.current;

    // Clone the scroller to ensure seamless looping
    const scrollerContent = Array.from(scrollerRef.current.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      scrollerRef.current?.appendChild(duplicatedItem);
    });

    // Calculate total width for animation calculation
    const scrollerWidth = scrollerRef.current.offsetWidth;
    const animationDuration = (scrollerWidth / speed) * 0.05; // Adjust factor for smoother animation

    const directionValue = direction === 'left' ? 1 : -1;

    // Set animation via CSS custom properties instead of inline styles
    scrollerRef.current.style.setProperty(
      '--duration',
      `${animationDuration}s`
    );
    scrollerRef.current.style.setProperty(
      '--direction',
      directionValue.toString()
    );

    // Add the animation class
    scrollerRef.current.classList.add('animate-scroll');

    // Pause on hover functionality
    const handleMouseEnter = () => {
      if (pauseOnHover && scrollerRef.current) {
        scrollerRef.current.style.animationPlayState = 'paused';
      }
    };

    const handleMouseLeave = () => {
      if (pauseOnHover && scrollerRef.current) {
        scrollerRef.current.style.animationPlayState = 'running';
      }
    };

    if (pauseOnHover) {
      currentContainerRef.addEventListener('mouseenter', handleMouseEnter);
      currentContainerRef.addEventListener('mouseleave', handleMouseLeave);
    }

    // Cleanup function
    return () => {
      if (pauseOnHover && currentContainerRef) {
        currentContainerRef.removeEventListener('mouseenter', handleMouseEnter);
        currentContainerRef.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [speed, direction, pauseOnHover]); // Dependencies

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Gradient masks */}
      <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

      {/* Main scroll container with ref */}
      <div ref={containerRef} className="w-full overflow-hidden">
        {/* Scroller element */}
        <div
          ref={scrollerRef}
          className="flex gap-4 py-4 w-max"
          style={{
            willChange: 'transform',
          }}
        >
          {items}
          {/* Second set of items added dynamically in useEffect */}
        </div>
      </div>
    </div>
  );
};

export default InfiniteMovingCards;
