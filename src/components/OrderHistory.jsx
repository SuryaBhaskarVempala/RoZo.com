import React, { useEffect, useState, useContext } from 'react';
import OrderCard from './OrderCard';
import axios from 'axios';
import { AuthContext } from '../store/AuthContext'; // adjust the path if needed
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const { navigate } = useNavigate();
  const [orders, setOrders] = useState(user.orders);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log(user.orders);
        if (!user || !user.orders || user.orders.length === 0) {
          navigate('/login');
          return;
        }

        const ids = user.orders.join(',');
        console.log(ids);
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${apiUrl}/orders?ids=${ids}`);
        setOrders(res.data); // Make sure backend returns array of full order objects
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/orders/${orderId}/cancel`);
      if (res.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, status: 'cancelled', canCancel: false }
              : order
          )
        );
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    return filterStatus === 'all' || order.status === filterStatus;
  });

  return (
    <div className="order-history">
      <div className="order-history-header">
        <h2>Your Orders</h2>
        <p>Track and manage all your RoZo orders</p>
      </div>

      <div className="order-filters">
        <div className="status-filters">
          {['all', 'pending', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-list">
        {loading ? (
          [...Array(3)].map((_, index) => (
            <div className="order-card" key={index}>
              <div className="order-header">
                <div className="order-info">
                </div>
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
            <OrderCard
              key={order._id}
              order={order}
            // onCancelOrder={handleCancelOrder}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
