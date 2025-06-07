
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
          <section id="home" className="hero-section">
            <div className="hero-background">
              <div className="floating-leaves">
                <span className="floating-leaf leaf-1">🌿</span>
                <span className="floating-leaf leaf-2">🍃</span>
                <span className="floating-leaf leaf-3">🌱</span>
                <span className="floating-leaf leaf-4">🌿</span>
                <span className="floating-leaf leaf-5">🍃</span>
              </div>
            </div>
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">
                  <span className="title-line">Transform Your Space</span>
                  <span className="title-line">with <span className="brand-highlight">Rojo</span></span>
                </h1>
                <p className="hero-subtitle">
                  🌱 Discover stunning plants with customizable pots that bring nature's beauty into your home
                </p>
                <div className="hero-features">
                  <div className="feature-item">
                    <span className="feature-icon">🏺</span>
                    <span>Custom Pot Colors</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">📏</span>
                    <span>Multiple Sizes</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">💚</span>
                    <span>Healthy Plants</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="plants" className="plants-section">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="title-decoration">🌿</span>
                  Our Plant Collection
                  <span className="title-decoration">🌿</span>
                </h2>
                <p className="section-subtitle">Handpicked plants for your perfect green space</p>
              </div>
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

          <section id="about" className="about-section">
            <div className="container">
              <div className="about-content">
                <h2 className="section-title">About Rojo</h2>
                <p className="about-text">
                  🌱 At Rojo, we believe every space deserves the beauty of nature. Our carefully curated collection of plants comes with customizable pots to match your unique style and space requirements.
                </p>
                <div className="about-features">
                  <div className="about-feature">
                    <h3>🌿 Premium Quality</h3>
                    <p>Hand-selected healthy plants from trusted growers</p>
                  </div>
                  <div className="about-feature">
                    <h3>🎨 Custom Design</h3>
                    <p>Choose from various pot colors and sizes to match your decor</p>
                  </div>
                  <div className="about-feature">
                    <h3>📦 Safe Delivery</h3>
                    <p>Carefully packaged and delivered to your doorstep</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="contact-section">
            <div className="container">
              <h2 className="section-title">Get in Touch</h2>
              <div className="contact-content">
                <div className="contact-info">
                  <div className="contact-item">
                    <span className="contact-icon">📧</span>
                    <span>hello@rojo.com</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📱</span>
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📍</span>
                    <span>123 Garden Street, Plant City</span>
                  </div>
                </div>
                <div className="contact-form">
                  <h3>Send us a message</h3>
                  <form>
                    <input type="text" placeholder="Your Name" className="form-input" />
                    <input type="email" placeholder="Your Email" className="form-input" />
                    <textarea placeholder="Your Message" className="form-textarea"></textarea>
                    <button type="submit" className="form-submit">Send Message 🌱</button>
                  </form>
                </div>
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
