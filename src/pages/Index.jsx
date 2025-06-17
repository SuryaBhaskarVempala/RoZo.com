import React, { useState, useRef, useEffect, useContext } from 'react';
import Header from '../components/Header';
import PlantCard from '../components/PlantCard';
import PlantDetails from '../components/PlantDetails';
import Footer from '../components/Footer';
import '../styles/index.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../store/AuthContext';

const Index = () => {
  const { plantsData, setPlantsData, loadingPlants, setLoadingPlants } = useContext(AuthContext);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/plants`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched plants data:', data);
        setPlantsData(data.plants);
        setLoadingPlants(false);
      })
      .catch(error => console.error('Error fetching plants:', error));
  }, []);

  const navigate = useNavigate();
  const [selectedPlant, setSelectedPlant] = useState(null);
  const scrollPositionRef = useRef(0);

  const handlePlantSelect = (plant) => {
    scrollPositionRef.current = window.scrollY;
    setSelectedPlant(plant);
  };

  const handleBackToHome = () => {
    setSelectedPlant(null);
  };

  useEffect(() => {
    if (selectedPlant) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: scrollPositionRef.current, behavior: 'smooth' });
    }
  }, [selectedPlant]);

  return (
    <div className="app">
      {!selectedPlant ? (
        <>
          <Header />
          <main className="main-content">
            <section id="home" className="hero-section">
              <div className="hero-background">
                <div className="floating-leaves">
                  <span className="floating-leaf leaf-1">🌿</span>
                  <span className="floating-leaf leaf-2">🌲</span>
                  <span className="floating-leaf leaf-3">🌱</span>
                  <span className="floating-leaf leaf-4">🌱</span>
                  <span className="floating-leaf leaf-5">🌿</span>
                </div>
              </div>
              <div className="hero-content">
                <div className="hero-text">
                  <h1 className="hero-title">
                    <span className="title-line">Transform Your Space</span>
                    <span className="title-line">
                      with <span className="brand-highlight">RoZo</span>
                    </span>
                  </h1>
                  <p className="hero-subtitle">
                    Explore eco-friendly plants with handcrafted pots bringing nature's purity and sustainability into your home.
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
            {loadingPlants ? (
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
                  <div className="plants-grid-shimmer">
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className="plant-card-shimmer">
                        <div className="plant-image-container-shimmer shimmer">
                          <img className="plant-image-shimmer" />
                          <div className="plant-overlay-shimmer shimmer">
                            <span className="view-details-shimmer"></span>
                          </div>
                        </div>
                        <div className="plant-info-shimmer">
                          <h3 className="plant-name-shimmer shimmer"></h3>
                          <p className="plant-description-shimmer shimmer"></p>
                          <div className="plant-price-shimmer shimmer">
                            <span className="price-from-shimmer"></span>
                            <span className="price-amount-shimmer"></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : (
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
                      <PlantCard key={plant.id} plant={plant} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            <section id="about" className="about-section">
              <div className="container">
                <div className="about-content">
                  <h2 className="section-title">About RoZo</h2>
                  <p className="about-text">
                    🌱 At RoZo, we believe every space deserves the beauty of nature. Our carefully curated
                    collection of plants comes with customizable pots to match your unique style and space
                    requirements.
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
                      <a href="mailto:hello@rojo.com" className="contact-link">hello@rojo.com</a>
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
                    <form className='contact-form-realForm'>
                      <input type="text" placeholder="Your Name" className="form-input" />
                      <input type="email" placeholder="Your Email" className="form-input" />
                      <textarea placeholder="Your Message" className="form-textarea"></textarea>
                      <button type="submit"  className="form-submit">
                        Send Message 🌱
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </>
      ) : (
        <PlantDetails plant={selectedPlant} onBack={handleBackToHome} />
      )}
      <Footer />
    </div>
  );
};

export default Index; 