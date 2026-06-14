import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Vacation, UpdateVacationData } from '../../types';
import { api, vacationsAPI } from '../../services/api';

const EditVacation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [vacation, setVacation] = useState<Vacation | null>(null);
  const [formData, setFormData] = useState<UpdateVacationData>({});
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchVacation = async () => {
      try {
        const response = await vacationsAPI.getVacationById(parseInt(id!));
        const vacationData = response.data;
        setVacation(vacationData);
        setFormData({
          destination: vacationData.destination,
          description: vacationData.description,
          start_date: vacationData.start_date.split('T')[0],
          end_date: vacationData.end_date.split('T')[0],
          price: vacationData.price
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch vacation');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchVacation();
    }
  }, [id]);

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
      const updateData: UpdateVacationData = {
        ...formData,
        image: image || undefined
      };

      await vacationsAPI.updateVacation(parseInt(id!), updateData);
      navigate('/admin/vacations');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update vacation');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="loading">Loading vacation...</div>;
  }

  if (!vacation) {
    return <div className="alert alert-error">Vacation not found</div>;
  }

  return (
    <div className="form-container form-wide">
      <h2>Edit Vacation</h2>
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="destination">Destination *</label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination || ''}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
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
            value={formData.start_date || ''}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="end_date">End Date *</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date || ''}
            onChange={handleChange}
            min={formData.start_date || ''}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price || 0}
            onChange={handleChange}
            min="0"
            max="10000"
            step="0.01"
            required
          />
        </div>
        
        {vacation.image_filename && (
          <div className="form-group">
            <label>Current Image</label>
            <img
              src={`http://localhost:3001/uploads/${vacation.image_filename}`}
              alt={vacation.destination}
              className="image-preview"
            />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="image">New Image (optional)</label>
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
            {loading ? 'Updating...' : 'Update Vacation'}
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

export default EditVacation;
