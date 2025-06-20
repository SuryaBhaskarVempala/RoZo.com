import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../store/AuthContext";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const { cartItems = [], totalAmount = 0 } = location.state || {};

  const [step, setStep] = useState(1);
  const [upiChecked, setUpiChecked] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    sparePhone: "",
    phone: user?.phone,
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState({});

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

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const paymentHandler = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Failed to load Razorpay SDK. Check your connection.");
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL_NONAPI}/order`, {
      method: "POST",
      body: JSON.stringify({
        amount: totalAmount * 100,
        currency: "INR",
        receipt: "receipt#1",
        items: cartItems.map((item) => ({
          productId: item.productId,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          quantity: item.quantity,
        })),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 🔴 If stock failure or server error
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.failures && Array.isArray(errorData.failures)) {
        const messages = errorData.failures
          .map((fail) => `• ${fail.productId}: ${fail.message}`)
          .join("\n");
        alert(`❌ Stock issues detected:\n\n${messages}`);
      } else {
        alert(`❌ ${errorData.message || "Failed to initiate order."}`);
      }
      return;
    }

    const order = await response.json();

    const options = {
      key: 'rzp_test_3KJDNoUaJnzWVM',
      amount: order.amount,
      currency: "INR",
      name: "RoZo",
      description: "Test Transaction",
      image: "https://w1.pngwing.com/pngs/523/470/png-transparent-green-leaf-logo-plants-garden-seedling-flower-garden-symbol-nursery-gardening.png",
      order_id: order.id,
      handler: async function (response) {
        const validateRes = await fetch(`${import.meta.env.VITE_API_URL_NONAPI}/order/validate`, {
          method: "POST",
          body: JSON.stringify(response),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await validateRes.json();

        if (result.msg === "success") {
          await placeOrder(result.orderId, result.paymentId);
        } else {
          alert("❌ Payment verification failed");
        }
      },
      prefill: {
        name: address.name,
        email: "RoZo@example.com",
        contact: address.phone,
      },
      notes: {
        address: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();

    rzp1.on("payment.failed", function (response) {
      alert("❌ Payment Failed: " + response.error.description);
      console.error(response.error);
    });
  };


  const placeOrder = async (orderId, paymentId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/orders/place-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: address.name,
          phone: address.phone,
          sparePhone: address.sparePhone,
          items: cartItems.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
          })),
          price: totalAmount,
          user: user._id,
          deliveryAddress: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
          paymentMethod: "via upi",
          paymentStatus: "Paid",
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Order placed successfully!");
        setUser(data.userData);
        navigate("/Account");
      } else {
        alert(`❌ Failed to place order: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("❌ Something went wrong. Please try again.");
    }
  };

  const handlePayment = async () => {
    if (!upiChecked) {
      alert("Please check the UPI box to continue.");
      return;
    }
    await paymentHandler();
  };

  useEffect(() => {
    if (!user || !cartItems || cartItems.length === 0 || totalAmount === 0) {
      navigate("/login");
    }
  }, [user, cartItems, totalAmount, navigate]);

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


            <h3 className="summary-subheading">Note : </h3>
            <div className="cart-card-container">
              <p className="cart-card-note">
                Please ensure the address is correct. We will not be able to change it once the order is placed.
              </p>
              <p>
                Don't press the back button or refresh the page during payment, wait until you get response !
              </p>
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
