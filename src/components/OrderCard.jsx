import React, { useState } from 'react';
import { toast } from './ui/use-toast';

const OrderCard = ({ order }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showTracking, setShowTracking] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#eca355';
      case 'confirmed': return '#2196f3';
      case 'shipped': return '#9c27b0';
      case 'delivered': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Order Pending';
      case 'confirmed': return 'Order Confirmed';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      onCancelOrder(order._id || order.id);
      toast({
        title: 'Order Cancelled',
        description: `Order #${order?.orderNumber} has been cancelled successfully`,
      });
    }
  };



  const handleTrackOrder = () => {
    if (!order.trackingNumber) {
      toast({
        title: 'Tracking Unavailable',
        description: 'Tracking information is not available for this order yet',
      });
      return;
    }
    setShowTracking(!showTracking);
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <div className="order-info">
          <div className="order-number">#{order._id}</div>
          <div className="order-date">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="order-status" style={{ backgroundColor: getStatusColor(order.status) }}>
          {getStatusText(order?.status)}
        </div>
        <div className="order-total">&#8377;{order.price}</div>
      </div>

      <div className="order-items-preview">
        {order.items.slice(0, 3).map((item, index) => (
          <div key={item.productId || index} className="item-preview">
            <img src={item.image} alt={item.name} />
            {index === 2 && order.items.length > 3 && (
              <div className="more-items">+{order.items.length - 3}</div>
            )}
          </div>
        ))}
        <div className="items-summary">
          {order.items.length} item{order.items.length > 1 ? 's' : ''}
        </div>
      </div>

      <div className="order-actions">
        <button className="action-btn secondary" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>
        <button className="action-btn secondary" onClick={handleTrackOrder}>
          Track Order
        </button>
        {order.canCancel && (
          <button className="action-btn danger" onClick={handleCancelOrder}>
            Cancel Order
          </button>
        )}
      </div>

      {showDetails && (
        <div className="order-details">
          <h4>Order Details</h4>
          <div className="items-list">
            {order.items.map((item, index) => (
              <div key={item.productId || index} className="order-item">
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-details">
                    Quantity: {item.quantity} × &#8377;{item.price.toFixed(2)}
                  </div>
                  <div className="item-details">
                    Size: {item.selectedSize} × Color : {item.selectedColor}
                  </div>
                </div>
                <div className="item-total">
                  &#8377;{(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="shipping-info">
            <h5>Shipping Address</h5>
            <div className="address">
              <div>{order.deliveryAddress}</div>
            </div>
          </div><br></br>
          <div className="shipping-info">
            <h5>Estimated Delivery Date</h5>
            <div className="address">
              <div>{new Date(order.deliveryDate).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}</div>
            </div>
          </div>

        </div>
      )}

      {showTracking && order.trackingNumber && (
        <div className="tracking-details">
          <h4>Order Tracking</h4>
          <div className="tracking-number">
            Tracking Number: <span>{order.trackingNumber}</span>
          </div>
          {order.estimatedDelivery && (
            <div className="estimated-delivery">
              Estimated Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
            </div>
          )}
          <div className="tracking-timeline">
            {order.trackingSteps.map((step, index) => (
              <div key={index} className={`timeline-step ${step.completed ? 'completed' : ''}`}>
                <div className="step-indicator"></div>
                <div className="step-content">
                  <div className="step-title">{step.step}</div>
                  {step.date ? (
                    <div className="step-date">
                      {new Date(step.date).toLocaleDateString()}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
