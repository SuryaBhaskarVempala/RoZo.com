import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../store/AuthContext";
import { useEffect } from "react";


function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user,setUser } = useContext(AuthContext);
  const { cartItems = [], totalAmount = 0 } = location.state || {};

  const [step, setStep] = useState(1);
  const [upiChecked, setUpiChecked] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    sparePhone: "",
    phone:user?.phone || '6304946937',
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState({});

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateAddress = () => {
    const errs = {};
    if (!address.name.trim()) errs.name = "Name is required";
    if (!/^[6-9]\d{9}$/.test(address.sparePhone)) errs.sparePhone = "Invalid spare phone number";
    if (!address.street.trim()) errs.street = "Street is required";
    if (!address.city.trim()) errs.city = "City is required";
    if (!address.state.trim()) errs.state = "State is required";
    if (!/^\d{6}$/.test(address.pincode)) errs.pincode = "Invalid pincode";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goToPayment = () => {
    if (validateAddress()) setStep(2);
  };


  useEffect(() => {
    if (!user || !cartItems || cartItems.length === 0 || totalAmount === 0) {
      navigate("/login");
    }
  }, [user, cartItems, totalAmount, navigate]);



  const handlePayment = async () => {
    if (!upiChecked) {
      alert("Please Fill All The Fileds");
      return;
    }


    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/orders/place-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: address.name,
          phone: user.phone,
          sparePhone: address.sparePhone,
          items: cartItems.map(item => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor
          })),
          price: totalAmount,
          user: user._id, // 🔁 Replace this with actual logged-in user ID
          deliveryAddress: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
          paymentMethod: "via upi",
          paymentStatus: "Paid"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Order placed successfully!");
        setUser(data.userData);
        navigate('/Account');
      } else {
        alert(`❌ Failed to place order: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("❌ Something went wrong. Please try again.");
    }
  };


  return (
    <div className="checkout-wrapper">
      <div className="checkout-container">
        {step === 1 && (
          <>
            <h2 className="checkout-heading">Shipping Address</h2>
            {[
              { name: "name", placeholder: "Full Name" },
              { name: "sparePhone", placeholder: "Spare Phone Number" },
              { name: "street", placeholder: "Street Address" },
              { name: "city", placeholder: "City" },
              { name: "state", placeholder: "State" },
              { name: "pincode", placeholder: "Pincode" },
            ].map(({ name, placeholder }) => (
              <div key={name} className="input-group">
                <input
                  name={name}
                  value={address[name]}
                  onChange={handleAddressChange}
                  placeholder={placeholder}
                  className="checkout-input"
                />
                {errors[name] && <p className="error-text">{errors[name]}</p>}
              </div>
            ))}
            <p className="checkout-fixed">
              Registered Phone: <strong>{address.phone}</strong>
            </p>
            <button onClick={goToPayment} className="checkout-button">
              Continue to Payment
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="checkout-heading">Payment</h2>
            <div className="checkout-summary">
              <p>
                <strong>Deliver to:</strong> {address.name}, {address.street},{" "}
                {address.city}, {address.state} – {address.pincode}
              </p>
              <p>
                <strong>Phone:</strong> {address.phone}
              </p>
            </div>

            <h3 className="summary-subheading">Order Summary</h3>
            <div className="cart-card-container">
              {cartItems.map((item, i) => (
                <div key={i} className="cart-card">
                  <img src={item.image} alt={item.name} className="cart-card-image" />
                  <div className="cart-card-details">
                    <h4 className="cart-card-name">{item.name}</h4>
                    <p className="cart-card-qty">Qty: {item.quantity}</p>
                    <p className="cart-card-price">Price: ₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="summary-total">Total: ₹{totalAmount}</p>

            <div className="upi-checkbox">
              <input
                type="checkbox"
                checked={upiChecked}
                onChange={() => setUpiChecked(!upiChecked)}
              />
              <label>Select to enable UPI, Card & Netbanking Payment</label>
            </div>

            <button
              onClick={handlePayment}
              className="checkout-button"
              disabled={!upiChecked}
            >
              Pay Now
            </button>

            <button onClick={() => setStep(1)} className="edit-link">
              ← Edit Address
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Checkout;
