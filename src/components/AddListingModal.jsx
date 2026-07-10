import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from './ui';
import './AddListingModal.css';

const AddListingModal = ({ isOpen, onClose, onListingAdded }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    location: '',
    price: '',
    description: '',
    longDescription: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.post('/api/destinations', formData, config);
      onListingAdded(response.data);
      onClose();
    } catch (err) {
      console.error('Error creating listing:', err);
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Add New Homestay</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="add-listing-form">
          <Input 
            label="Homestay Name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
          
          <Input 
            label="Image URL" 
            name="image" 
            placeholder="https://example.com/image.jpg"
            value={formData.image} 
            onChange={handleChange} 
            required 
          />
          
          <Input 
            label="Location" 
            name="location" 
            placeholder="City, Country"
            value={formData.location} 
            onChange={handleChange} 
            required 
          />
          
          <Input 
            label="Price per night" 
            name="price" 
            placeholder="$100"
            value={formData.price} 
            onChange={handleChange} 
            required 
          />
          
          <div className="form-group">
            <label>Short Description</label>
            <textarea 
              name="description" 
              rows="2"
              value={formData.description} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Detailed Description</label>
            <textarea 
              name="longDescription" 
              rows="4"
              value={formData.longDescription} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <Button type="submit" loading={loading} className="submit-btn">
            Create Listing
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddListingModal;
