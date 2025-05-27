import React, { useState } from 'react';
import './App.css';
import BottomSheet from './BottomSheet';

function App() {
  const [sheetPosition, setSheetPosition] = useState('closed');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Travel Explorer</h1>
        <p>Discover amazing destinations around the world</p>
      </header>

      <main className="App-content">
        <div className="hero-section">
          <h2>Your Next Adventure Awaits</h2>
          <p>Browse our collection of hand-picked travel destinations</p>
          <button 
            className="cta-button"
            onClick={() => setSheetPosition('open')} // <-- Open full view on click
          >
            Explore More
          </button>
        </div>

        <div className="featured-destinations">
          <h3>Popular Destinations</h3>
          <div className="destination-grid">
          </div>
        </div>
      </main>

      <BottomSheet position={sheetPosition} setPosition={setSheetPosition} />
    </div>
  );
}

export default App;


