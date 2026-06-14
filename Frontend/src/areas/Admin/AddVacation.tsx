import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateVacationData } from '../../types';
import { api, vacationsAPI } from '../../services/api';

const AddVacation: React.FC = () => {
  const [formData, setFormData] = useState<CreateVacationData>({
    destination: '',
    description: '',
    start_date: '',
    end_date: '',
    price: 0
  });
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === 'price' ? parseFloat(e.target.value) || 0 : e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const vacationData: CreateVacationData = {
        ...formData,
        image: image || undefined
      };

      await vacationsAPI.createVacation(vacationData);
      navigate('/admin/vacations');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create vacation');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="form-container form-wide">
      <h2>Add New Vacation</h2>
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="destination">Destination *</label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="start_date">Start Date *</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            min={today}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="end_date">End Date *</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            min={formData.start_date || today}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            max="10000"
            step="0.01"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Vacation'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/admin/vacations')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVacation;
