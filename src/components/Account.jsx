import React, { useContext, useEffect, useState } from 'react';
import OrderHistory from './OrderHistory';
import ProfileSettings from './ProfileSettings';
import { AuthContext } from '../store/AuthContext';
import { toast } from './ui/use-toast';
import '../styles/account-profile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AccountProfile = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext); // contains user._id and user.orders (array of Order IDs)
  const [activeTab, setActiveTab] = useState('orders');

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      toast({ title: "Logged out", description: "You have been logged out." });
      // Add your logout logic here (e.g. clear tokens, redirect)
    }
  };


  const handleHelpSupport = () => {
    // Create a help & support modal or redirect
    const helpWindow = window.open('', '_blank', 'width=600,height=700,scrollbars=yes,resizable=yes');
    if (helpWindow) {
      helpWindow.document.write(`
        <html>
          <head>
            <title>Help & Support</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
              .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              h1 { color: #333; text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 25px; padding: 15px; border-left: 4px solid #007bff; background: #f8f9fa; }
              .section h3 { margin: 0 0 10px 0; color: #007bff; }
              .contact-item { margin: 10px 0; }
              .contact-item strong { color: #333; }
              .faq-item { margin: 15px 0; }
              .faq-question { font-weight: bold; color: #333; margin-bottom: 5px; }
              .faq-answer { color: #666; margin-left: 15px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Help & Support</h1>
              
              <div class="section">
                <h3>Contact Us</h3>
                <div class="contact-item"><strong>Email:</strong> support@rozo.com</div>
                <div class="contact-item"><strong>Phone:</strong> 1-800-ROZO-HELP</div>
                <div class="contact-item"><strong>Live Chat:</strong> Available 24/7</div>
                <div class="contact-item"><strong>Hours:</strong> Mon-Fri 9AM-6PM EST</div>
              </div>

              <div class="section">
                <h3>Frequently Asked Questions</h3>
                <div class="faq-item">
                  <div class="faq-question">How can I track my order?</div>
                  <div class="faq-answer">Go to Orders & Tracking tab and click "Track Order" on any shipped order.</div>
                </div>
                <div class="faq-item">
                  <div class="faq-question">Can I cancel my order?</div>
                  <div class="faq-answer">Yes, you can cancel orders that are still pending or confirmed.</div>
                </div>
                <div class="faq-item">
                  <div class="faq-question">How do I update my profile?</div>
                  <div class="faq-answer">Go to Profile Settings tab and click "Edit Profile" to make changes.</div>
                </div>
                <div class="faq-item">
                  <div class="faq-question">What payment methods do you accept?</div>
                  <div class="faq-answer">We accept all major credit cards, PayPal, and Apple Pay.</div>
                </div>
              </div>

              <div class="section">
                <h3>Quick Actions</h3>
                <div class="contact-item">• Report an issue with your order</div>
                <div class="contact-item">• Request a refund or return</div>
                <div class="contact-item">• Update delivery information</div>
                <div class="contact-item">• Account security help</div>
              </div>
            </div>
          </body>
        </html>
      `);
      helpWindow.document.close();
    }

    toast({
      title: "Help & Support",
      description: "Opening support center with live chat, FAQs, and contact options"
    });
    console.log('Opening help & support');
  };

  const handleHelp = () => {
    const win = window.open("", "_blank", "width=600,height=700");
    if (win) {
      win.document.write(`<h2>Help & Support</h2><p>Contact support@rozo.com</p>`);
      win.document.close();
    }
    toast({ title: "Help & Support", description: "Support window opened." });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrderHistory />;
      case 'settings':
        return <ProfileSettings user={user} />;
      default:
        return <OrderHistory />;
    }
  };

  if (!user) return (
    <div className="loading-overlay">
      <div className="spinner"></div>
    </div>
  );


  return (<div className="account-profile-container">
    <div className="profile-sidebar">
      <div className="profile-header">
        <div className="profile-image">
          <img src={user?.profileImage || "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=150&h=150&fit=crop&crop=face"} alt="Profile" />
          <div className="online-indicator"></div>
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <div className="member-since">
            Member since {new Date(user.createdAt).toLocaleDateString().split('/')[2]}
          </div>
        </div>
      </div>

      <nav className="profile-nav">
        <button
          className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <span className="nav-icon">📦</span>
          Orders & Tracking
        </button>
        <button
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <span className="nav-icon">⚙️</span>
          Profile Settings
        </button>
        <button
          className={`nav-item `}
          onClick={() => navigate('/')}
        >
          <span className="nav-icon">🏠
          </span>
          Home
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={() => {
          setUser(null); // Clear user context on logout
          localStorage.removeItem('token'); // Clear user from local storage
          window.location.href = '/';
        }}>
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </div>
    </div>

    <div className="profile-main">
      <div className="main-header">
        <div className="breadcrumb">
          <span>Account</span>
          <span className="separator">→</span>
          <span className="current">
            {activeTab === 'orders' ? 'Orders & Tracking' : 'Profile Settings'}
          </span>
        </div>
        <div className="header-actions">
          <button className="help-btn" onClick={handleHelpSupport}>
            Help & Support
          </button>
        </div>
      </div>

      <div className="main-content-account">
        {renderTabContent()}
      </div>
    </div>
  </div>
  );
}
export default AccountProfile;
