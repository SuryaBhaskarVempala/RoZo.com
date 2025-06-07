
import React from 'react';

const PlantCard = ({ plant, onSelect }) => {
  return (
    <div className="plant-card" onClick={() => onSelect(plant)}>
      <div className="plant-image-container">
        <img src={plant.image} alt={plant.name} className="plant-image" />
        <div className="plant-overlay">
          <span className="view-details">View Details</span>
        </div>
      </div>
      <div className="plant-info">
        <h3 className="plant-name">{plant.name}</h3>
        <p className="plant-description">{plant.shortDescription}</p>
        <div className="plant-price">
          <span className="price-from">From </span>
          <span className="price-amount">${plant.basePrice}</span>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
