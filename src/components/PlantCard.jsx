
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PlantCard = ({ plant, onSelect }) => {
  const navigate = useNavigate();

  // Generate random index between 0 and 4
  const randomIndex = Math.floor(Math.random() * 5);

  // Use image at random index, fallback to 0 if not available
  const imageUrl = plant.image[randomIndex] || plant.image[0];


  return (
    <div className="plant-card" onClick={() => {
      navigate(`/plantDetails/${plant.id}`);
    }}>
      <div className="plant-image-container">
        <img src={imageUrl} alt={plant.name} className="plant-image" />
        <div className="plant-overlay">
          <span className="view-details">View Details</span>
        </div>
      </div>
      <div className="plant-info">
        <h3 className="plant-name">{plant.name}</h3>
        <p className="plant-description">{plant.shortDescription}</p>
        <div className="plant-price">
          <span className="price-from">From </span>
          <span className="price-amount">₹{plant.basePrice}</span>
        </div>
      </div>
    </div >
  );
};

export default PlantCard;
