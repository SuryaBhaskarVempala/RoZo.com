import React, { useEffect, useState, useContext } from 'react';
import OrderCard from './OrderCard';
import axios from 'axios';
import { AuthContext } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user || !user.orders || user.orders.length === 0) {
          navigate('/login');
          return;
        }

        const ids = user.orders.join(',');
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${apiUrl}/orders?ids=${ids}`);
        setOrders(res.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filterStatus]);

  const getLastCompletedStep = (trackingSteps = []) => {
    return [...trackingSteps].reverse().find(step => step.completed)?.step;
  };

  const filteredOrders =
    filterStatus === 'All'
      ? orders
      : orders.filter((order) => {
          const lastStep = getLastCompletedStep(order.trackingSteps);
          return lastStep === filterStatus;
        });

  return (
    <div className="order-history">
      <div className="order-history-header">
        <h2>Your Orders</h2>
        <p>Track and manage all your RoZo orders</p>
      </div>

      <div className="order-filters">
        <div className="status-filters">
          {['All', 'Order Placed', 'Shipped', 'Delivered'].map((status) => (
            <button
              key={status}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-list">
        {loading ? (
          [...Array(3)].map((_, index) => (
            <div className="order-card skeleton" key={index}>
              <div className="order-header">
                <div className="order-info" />
              </div>
            </div>
          ))
        ) : filteredOrders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h3>No orders found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
