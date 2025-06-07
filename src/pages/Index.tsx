
import React, { useState } from 'react';
import Header from '../components/Header';
import PlantCard from '../components/PlantCard';
import PlantDetails from '../components/PlantDetails';
import Footer from '../components/Footer';
import { plantsData } from '../data/plantsData';
import '../styles/index.css';

const Index = () => {
  const [selectedPlant, setSelectedPlant] = useState(null);

  const handlePlantSelect = (plant) => {
    setSelectedPlant(plant);
  };

  const handleBackToHome = () => {
    setSelectedPlant(null);
  };

  return (
    <div className="app">
      <Header />
      
      {!selectedPlant ? (
        <main className="main-content">
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">
                Welcome to <span className="brand-name">Rojo</span>
              </h1>
              <p className="hero-subtitle">
                Discover beautiful plants with customizable pots for your perfect space
              </p>
            </div>
          </section>

          <section className="plants-section">
            <div className="container">
              <h2 className="section-title">Our Plant Collection</h2>
              <div className="plants-grid">
                {plantsData.map((plant) => (
                  <PlantCard 
                    key={plant.id} 
                    plant={plant} 
                    onSelect={handlePlantSelect}
                  />
                ))}
              </div>
            </div>
          </section>
        </main>
      ) : (
        <PlantDetails 
          plant={selectedPlant} 
          onBack={handleBackToHome}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
