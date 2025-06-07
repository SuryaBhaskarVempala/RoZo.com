
import React, { useState, useEffect } from 'react';

const PlantDetails = ({ plant, onBack }) => {
  const [selectedSize, setSelectedSize] = useState('small');
  const [selectedColor, setSelectedColor] = useState(plant.potColors[0]);
  const [currentPrice, setCurrentPrice] = useState(plant.basePrice);

  useEffect(() => {
    // Calculate price based on size
    const sizeMultiplier = {
      small: 1,
      medium: 1.5,
      large: 2
    };
    const newPrice = plant.basePrice * sizeMultiplier[selectedSize];
    setCurrentPrice(newPrice);
  }, [selectedSize, plant.basePrice]);

  return (
    <div className="plant-details">
      <div className="container">
        <button className="back-btn" onClick={onBack}>
          ← Back to Plants
        </button>
        
        <div className="details-content">
          <div className="details-image">
            <img src={plant.image} alt={plant.name} />
          </div>
          
          <div className="details-info">
            <h1 className="details-title">{plant.name}</h1>
            <p className="details-description">{plant.fullDescription}</p>
            
            <div className="characteristics">
              <h3>Plant Characteristics</h3>
              <ul className="characteristics-list">
                {plant.characteristics.map((char, index) => (
                  <li key={index}>{char}</li>
                ))}
              </ul>
            </div>
            
            <div className="customization">
              <div className="size-selection">
                <h3>Pot Size</h3>
                <div className="size-options">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="color-selection">
                <h3>Pot Color</h3>
                <div className="color-options">
                  {plant.potColors.map((color) => (
                    <button
                      key={color}
                      className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="price-section">
              <div className="current-price">
                <span className="price-label">Price: </span>
                <span className="price-value">${currentPrice.toFixed(2)}</span>
              </div>
              <button className="add-to-cart-btn">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;
