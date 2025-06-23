import React, { useContext, useEffect, useState } from 'react';
import { toast } from './ui/use-toast';
import { AuthContext } from '../store/AuthContext';
import axios from 'axios';

const ProfileSettings = () => {

  const { user, setUser } = useContext(AuthContext);


  const [formData, setFormData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);


  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    marketing: false,
    orderReminders: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({ title: 'Error', description: 'Name is required' });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${apiUrl}/user/update-name`, {
        name: formData.name,
        id: user._id
      });

      setUser(res.data.user); // <- update global context user here
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Name updated successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update name. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };


  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
    toast({
      title: 'Changes discarded',
      description: 'All unsaved changes have been discarded.',
    });
  };

  const handleImageChange = async (e) => {
    toast({
      title: 'Profile Image',
      description: 'Profile Image Change would Coming Soon',
    });
    // const file = e.target.files?.[0];
    // if (!file) return;

    // if (file.size > 5 * 1024 * 1024) {
    //   toast({ title: 'Error', description: 'Image must be less than 5MB' });
    //   return;
    // }

    // if (!file.type.startsWith('image/')) {
    //   toast({ title: 'Error', description: 'Please select a valid image file' });
    //   return;
    // }

    // const formData = new FormData();
    // formData.append('image', file);

    // try {
    //   const res = await axios.post(`http://localhost:3000/api/user/upload-profile-image/${user._id}`, formData, {
    //     headers: { 'Content-Type': 'multipart/form-data' },
    //   });

    //   toast({
    //     title: 'Profile image updated',
    //     description: 'Image uploaded successfully!',
    //   });

    //   // Update UI immediately
    //   setFormData((prev) => ({
    //     ...prev,
    //     profileImage: res.data.imageUrl,
    //   }));

    // } catch (err) {
    //   toast({ title: 'Error', description: 'Image upload failed' });
    // }
  };

  const handleNotificationToggle = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
    toast({
      title: 'Preference updated',
      description: `${type} notifications ${notifications[type] ? 'disabled' : 'enabled'}`,
    });
  };

  const handlePasswordChange = () => {
    toast({
      title: 'Password change',
      description: 'Password change functionality Coming Soon',
    });
  };

  const handleEnable2FA = () => {
    toast({
      title: '2FA Setup',
      description: 'Two-factor authentication setup would Coming Soon',
    });
  };

  const handleViewActivity = () => {
    toast({
      title: 'Login Activity',
      description: 'Login activity details would Comeing Soon',
    });
  };

  return (
    <div className="profile-settings">
      <div className="settings-header">
        <h2>Profile Settings</h2>
        <p>Manage your personal information and preferences</p>
      </div>

      <div className="settings-tabs">
        <button className={`tab-btn ${activeSection === 'personal' ? 'active' : ''}`} onClick={() => setActiveSection('personal')}>
          Personal Info
        </button>
        <button className={`tab-btn ${activeSection === 'security' ? 'active' : ''}`} onClick={() => setActiveSection('security')}>
          Security
        </button>
        <button className={`tab-btn ${activeSection === 'preferences' ? 'active' : ''}`} onClick={() => setActiveSection('preferences')}>
          Preferences
        </button>
      </div>

      {activeSection === 'personal' && (
        <div className="settings-section">
          <div className="section-header-account">
            <h3>Personal Information</h3>
            {!isEditing ? (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button className="cancel-btn" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="profile-form">
            <div className="profile-image-section">
              <div className="current-image">
                <img src={formData.profileImage} alt="Profile" />
              </div>
              <div className="image-upload">
                <input type="file" id="profile-image" accept=".jpg,.jpeg,.png,image/jpeg,image/jpg,image/png" onChange={handleImageChange} className="file-input" />
                <label htmlFor="profile-image" className="upload-btn">
                  Change Photo
                </label>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                  Max 5MB • JPG , JPEG , PNG
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} className="form-input" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} disabled={true} className="form-input" required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} disabled={true} className="form-input" required />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'security' && (
        <div className="settings-section">
          <h3>Security Settings</h3>
          <div className="security-options">
            <div className="security-item">
              <div className="security-info">
                <h4>Password</h4>
                <p>Last changed 30 days ago</p>
              </div>
              <button className="change-btn" onClick={handlePasswordChange}>
                Change Password
              </button>
            </div>
            <div className="security-item">
              <div className="security-info">
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security to your account</p>
              </div>
              <button className="enable-btn" onClick={handleEnable2FA}>
                Enable 2FA
              </button>
            </div>
            <div className="security-item">
              <div className="security-info">
                <h4>Login Activity</h4>
                <p>See recent login activity and manage sessions</p>
              </div>
              <button className="view-btn" onClick={handleViewActivity}>
                View Activity
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'preferences' && (
        <div className="settings-section">
          <h3>Preferences</h3>
          <div className="preferences-list">
            {['email', 'sms', 'marketing', 'orderReminders'].map((type) => (
              <div className="preference-item" key={type}>
                <div className="preference-info">
                  <h4>{type.charAt(0).toUpperCase() + type.slice(1)} Notifications</h4>
                  <p>{type === 'marketing' ? 'Receive promotional offers and product updates' : type === 'orderReminders' ? 'Get reminders about items in your cart' : `Get updates via ${type}`}</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={notifications[type]} onChange={() => handleNotificationToggle(type)} />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
