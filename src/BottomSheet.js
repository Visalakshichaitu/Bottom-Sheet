
import React, { useRef, useEffect, useCallback } from 'react';
import './BottomSheet.css';

const BottomSheet = ({ position, setPosition }) => {
  const sheetRef = useRef(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const isDraggingRef = useRef(false);

  const destinations = [
    {
      id: 1,
      name: "Bali, Indonesia",
      description: "Known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 2,
      name: "Paris, France",
      description: "The City of Light, famous for its cafe culture, the Eiffel Tower, and the Louvre Museum.",
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 3,
      name: "Tokyo, Japan",
      description: "A blend of ultramodern and traditional, from neon-lit skyscrapers to historic temples.",
      image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
     {
      id: 4,
      name: "New York, USA",
      description: "The city that never sleeps, famous for its iconic skyline, Broadway shows, and Central Park.",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    }
  ];

  const getPositions = useCallback(() => ({
    closed: window.innerHeight - 160,
    half: window.innerHeight * 0.5,
    open: 60
  }), []);

  const handleStart = (clientY) => {
    isDraggingRef.current = true;
    startYRef.current = clientY;
    currentYRef.current = parseInt(
      sheetRef.current.style.transform.replace('translateY(', '').replace('px)', '') || 
      getPositions()[position]
    );
    sheetRef.current.style.transition = 'none';
  };

  const handleMove = (clientY) => {
    if (!isDraggingRef.current) return;
    const deltaY = clientY - startYRef.current;
    let newY = currentYRef.current + deltaY;
    const positions = getPositions();
    newY = Math.max(positions.open, Math.min(newY, positions.closed));
    sheetRef.current.style.transform = `translateY(${newY}px)`;
  };

  const handleEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const currentY = parseInt(
      sheetRef.current.style.transform.replace('translateY(', '').replace('px)', '')
    );
    const positions = getPositions();
    let closestPosition = Object.entries(positions).reduce(
      (closest, [pos, y]) => {
        const diff = Math.abs(currentY - y);
        return diff < closest.diff ? { pos, diff } : closest;
      },
      { pos: position, diff: Infinity }
    ).pos;
    sheetRef.current.style.transition = 'transform 0.3s cubic-bezier(0.17, 0.67, 0.21, 1.02)';
    setPosition(closestPosition);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    const handleResize = () => {
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${getPositions()[position]}px)`;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position, getPositions]);

  useEffect(() => {
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${getPositions()[position]}px)`;
    }
  }, [position, getPositions]);

  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') setPosition('open');      
      if (e.key === 'ArrowDown') setPosition('closed');   
      if (e.key === ' ') setPosition('half');             
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setPosition]);

  return (
    <div
      className="bottom-sheet"
      ref={sheetRef}
      style={{
        transform: `translateY(${getPositions()[position]}px)`,
        transition: 'transform 0.3s cubic-bezier(0.17, 0.67, 0.21, 1.02)',
      }}
    >
      <div
        className="handle"
        onTouchStart={(e) => {
          e.stopPropagation();
          handleStart(e.touches[0].clientY);
        }}
        onTouchMove={(e) => {
          if (isDraggingRef.current) e.preventDefault();
          handleMove(e.touches[0].clientY);
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          handleEnd();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleStart(e.clientY);
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
      >
        <div className="handle-bar" />
        <div className="peek-content">
          <span>▼ Drag up to explore ▼</span>
        </div>
      </div>
      <div className="content">
        <div className="content-body">
          <h2>Travel Destination Explorer</h2>
          <div className="destinations-grid">
            {destinations.map((destination) => (
              <div key={destination.id} className="destination-card">
                <div className="image-container">
                  <img src={destination.image} alt={destination.name} loading="lazy" />
                </div>
                <h3>{destination.name}</h3>
                <p>{destination.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="controls">
          <button onClick={() => setPosition('closed')}>Minimize</button>
          <button onClick={() => setPosition('half')}>Half View</button>
          <button onClick={() => setPosition('open')}>Full View</button>
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
