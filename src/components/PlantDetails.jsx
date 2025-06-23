import React, { useContext, useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { addToCart } from '../store/cartSlice';
import HeaderForPlantDetails from './HeaderForPlantDetails';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { AuthContext } from '../store/AuthContext';
import { CartContext } from '../store/CartContext';

const PlantDetails = () => {
  const { addToCart } = useContext(CartContext);
  const { id } = useParams();
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [plant, setPlant] = useState(null);
  const [plantDetailsLoading, setPlantDetailsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [imgSrc, setImgSrc] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  useEffect(() => {
    const fetchPlant = () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      fetch(`${apiUrl}/plants/${id}`)
        .then(response => response.json())
        .then(data => {
          if (!data?.plant) {
            toast({
              title: 'Error',
              description: '❌ Plant not found',
            });
            navigate('/');
            return;
          }

          const safePlant = {
            ...data.plant,
            image: data.plant.image ?? [],
            sizeInfo: data.plant.sizeInfo ?? {},
            characteristics: data.plant.characteristics ?? [],
            potColors: data.plant.potColors ?? [],
            basePrice: data.plant.basePrice ?? 0,
          };

          const sizeKeys = Object.keys(safePlant?.sizeInfo || {});
          const defaultSize = sizeKeys?.length > 0 ? sizeKeys[0] : '';

          const firstAvailableColor = safePlant?.potColors.find(
            color => color?.[`${defaultSize}PotsCount`] > 0
          );

          setPlant(safePlant);
          setImgSrc(safePlant?.image[0] || '');
          setSelectedSize(defaultSize);
          setSelectedColor(firstAvailableColor?.name || '');
          setCurrentPrice(safePlant?.basePrice);
        })
        .catch(error => {
          console.error('Error fetching plant:', error);
          toast({
            title: 'Error',
            description: '❌ Failed to load plant details',
          });
        })
        .finally(() => {
          setPlantDetailsLoading(false);
        });
    };

    fetchPlant();
  }, [id, navigate]);


  useEffect(() => {
    if (!plant || !selectedSize || !selectedColor) return;

    const sizePrice = plant?.sizeInfo[selectedSize]?.price ?? plant.basePrice ?? 50;
    const colorPrice = plant?.potColors.find(c => c.name === selectedColor)?.price ?? 10;

    const finalPrice = sizePrice + colorPrice;
    setCurrentPrice(finalPrice);
  }, [selectedSize, selectedColor, plant]);



  useEffect(() => {
    if (!plant || !selectedSize) return;

    const availableColor = plant?.potColors.find(
      color => color?.[`${selectedSize}PotsCount`] > 0
    );

    const currentSelected = plant?.potColors.find(
      c => c.name === selectedColor && c?.[`${selectedSize}PotsCount`] > 0
    );

    if (!currentSelected) {
      setSelectedColor(availableColor?.name || '');
    }
  }, [selectedSize, plant]);

  const currentSizeInfo = plant?.sizeInfo[selectedSize] || {};

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    console.log("user : " + user);

    setIsAdding(true);

    console.log("userId : " + user?._id);
    addToCart({
      userId: user?._id,
      productId: plant?.id,
      name: plant?.name,
      image: imgSrc,
      price: currentPrice,
      selectedSize,
      selectedColor,
    });

    setTimeout(() => setIsAdding(false), 600);
  };

  const changeImage = (index) => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setImgSrc(plant.image[index]);
      setFadeIn(true);
    }, 200);
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) changeImage(currentImageIndex - 1);
  };

  const handleNextImage = () => {
    if (currentImageIndex < plant.image.length - 1) changeImage(currentImageIndex + 1);
  };

  const handleBack = () => navigate(-1);
  const openImageModal = () => setIsModalOpen(true);
  const closeImageModal = () => setIsModalOpen(false);

  const potCount =
    (plant?.potColors.find(c => c.name === selectedColor) || {})[
    `${selectedSize}PotsCount`
    ] || 0;

  return (
    plantDetailsLoading || !plant ?
      (<>
        <HeaderForPlantDetails />
        <div className="plant-details">
          <div className="container">
            <button className="back-btn shimmer-btn" onClick={() => handleBack()}>← Back to Plants</button>

            <div className="details-content">
              {/* Image Section */}
              <div className="details-image-wrapper-shimmer shimmer">
                <div className="details-image-shimmer shimmer"></div>
              </div>

              {/* Info Section */}
              <div className="details-info">
                <h1 className="details-title-shimmer shimmer"></h1>
                <p className="details-description"></p>

                {/* Characteristics */}
                <div className="characteristics-shimmer">
                  <h3 className="shimmer-text"></h3>
                  <ul className="characteristics-list-shimmer">
                    {[...Array(4)].map((_, i) => (
                      <li key={i} className="shimmer-line-shimmer shimmer"></li>
                    ))}
                  </ul>
                </div>

                {/* Customization */}
                <div className="customization">
                  {/* Size Selection */}
                  <div className="size-selection">
                    <div className="size-options-shimmer">
                      {[...Array(3)].map((_, index) => (
                        <button key={index} className="size-btn-shimmer shimmer"></button>
                      ))}
                    </div>
                    <div className="size-description-shimmer shimmer"></div>
                  </div>

                  {/* Color Selection */}
                  <div className="color-selection">
                    <h3 className="shimmer-text shimmer"></h3>
                    <div className="color-options">
                      {[...Array(4)].map((_, i) => (
                        <button key={i} className="color-btn shimmer-circle shimmer"></button>
                      ))}
                    </div>
                    <div className="potCounts shimmer-box shimmer">
                      <p className="shimmer-text shimmer"></p>
                      <h5 className="shimmer-text shimmer"></h5>
                    </div>
                  </div>
                </div>

                {/* Price & Add to Cart */}
                <div className="price-section">
                  <div className="current-price shimmer-text shimmer">
                    <span className="price-label shimmer-text shimmer"></span>
                    <span className="price-value shimmer-text shimmer"></span>
                  </div>
                  <button className="add-to-cart-btn shimmer-btn shimmer"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>)
      :
      <>
        <HeaderForPlantDetails />
        <div className="plant-details">
          <div className="container">
            <button className="back-btn" onClick={handleBack}>
              ← Back to Plants
            </button>

            <div className="details-content">
              {/* Image Section */}
              <div className="details-image-wrapper">
                <div className="details-image-container">
                  <img
                    src={imgSrc}
                    alt={plant.name}
                    className={`details-image ${fadeIn ? 'fade-in' : ''}`}
                    onClick={openImageModal}
                    style={{ cursor: 'zoom-in' }}
                  />
                  {currentImageIndex > 0 && (
                    <button className="nav-btn left" onClick={handlePrevImage}>❮</button>
                  )}
                  {currentImageIndex < plant.image.length - 1 && (
                    <button className="nav-btn right" onClick={handleNextImage}>❯</button>
                  )}
                </div>
              </div>

              {/* Info Section */}
              <div className="details-info">
                <h1 className="details-title">{plant.name}</h1>
                <p className="details-description">{plant.fullDescription}</p>

                <div className="characteristics">
                  <h3>Plant Characteristics</h3>
                  <ul className="characteristics-list">
                    {plant.characteristics.map((char, i) => (
                      <li key={i}>{char}</li>
                    ))}
                  </ul>
                </div>

                <div className="customization">
                  {/* Size Selection */}
                  <div className="size-selection">
                    <h3>Pot & Plant Size</h3>
                    <div className="size-options">
                      {Object.keys(plant.sizeInfo).map((size) => (
                        <button
                          key={size}
                          className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size.charAt(0).toUpperCase() + size.slice(1)}
                        </button>
                      ))}
                    </div>
                    {currentSizeInfo && (
                      <div className="size-description">
                        <small>Pot: {currentSizeInfo.potSize}</small><br />
                        <small>Plant: {currentSizeInfo.plantHeight}</small>
                        <p>{currentSizeInfo.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Color Selection */}
                  <div className="color-selection">
                    <h3>Available Pot Colors</h3>
                    <div className="color-options">
                      {plant.potColors
                        .filter(color => color?.[`${selectedSize}PotsCount`] > 0)
                        .map(color => (
                          <button
                            key={color.name}
                            className={`color-btn ${selectedColor === color.name ? 'active' : ''}`}
                            style={{ backgroundColor: color.name }}
                            onClick={() => setSelectedColor(color.name)}
                            title={color.name}
                          />
                        ))}
                    </div>

                    <div className={`potCounts ${potCount > 5 ? 'ok' : 'notOk'}`}>
                      <p>{potCount}</p>
                      <h5>Pots available</h5>
                    </div>
                  </div>
                </div>

                {/* Price & Add to Cart */}
                <div className="price-section">
                  <div className="current-price">
                    <span className="price-label">Price: </span>
                    <span className="price-value">₹
                      {currentPrice.toFixed(2)}</span>
                  </div>
                  <button
                    className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
                    onClick={handleAddToCart}
                    disabled={isAdding || !selectedColor}
                  >
                    {isAdding ? 'Adding to Cart... 🌱' : 'Add to Cart 🛒'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {isModalOpen && (
          <div className="image-modal-overlay" onClick={closeImageModal}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
              <img src={imgSrc} alt="Zoomed Plant" className="modal-image" />
            </div>
          </div>
        )}

        <Footer />
      </>
  );
};

export default PlantDetails;
