import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api, vacationsAPI } from '../../services/api';
import VacationCard from './VacationCard';
import { Vacation } from '../../types';

const Vacations: React.FC = () => {
  const { user } = useAuth();
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');

  const fetchVacations = async (page: number = 1, filterType: string = 'all') => {
    try {
      setLoading(true);
      const response = await vacationsAPI.getVacations(page, filterType);
      setVacations(response.data.vacations);
      setTotalPages(response.data.pagination.totalPages);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch vacations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacations(currentPage, filter);
  }, [filter]);

  const handleLikeToggle = async (vacationId: number, isLiked: boolean) => {
    try {
      const vacation = vacations.find(v => v.vacation_id === vacationId);
      if (!vacation) return;

      if (isLiked) {
        await api.delete(`/vacations/${vacationId}/like`);
        vacation.is_liked = false;
        vacation.likes_count -= 1;
      } else {
        await api.post(`/vacations/${vacationId}/like`);
        vacation.is_liked = true;
        vacation.likes_count += 1;
      }

      setVacations([...vacations]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update like');
    }
  };

  const handlePageChange = (page: number) => {
    fetchVacations(page, filter);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="loading">Loading vacations...</div>;
  }

  return (
    <div>
      <div className="admin-header">
        <h1>🌍 Explore Vacations</h1>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All Vacations
          </button>
          <button 
            className={`filter-btn ${filter === 'liked' ? 'active' : ''}`}
            onClick={() => handleFilterChange('liked')}
          >
            My Favorites
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => handleFilterChange('active')}
          >
            Currently Active
          </button>
          <button 
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => handleFilterChange('upcoming')}
          >
            Upcoming
          </button>
        </div>
      </div>
      
      {error && <div className="alert alert-error">{error}</div>}

      {vacations.length === 0 ? (
        <div className="loading">No vacations found</div>
      ) : (
        <>
          <div className="vacations-grid">
            {vacations.map((vacation) => (
              <VacationCard
                key={vacation.vacation_id}
                vacation={vacation}
                onLikeToggle={handleLikeToggle}
                showLikeButton={true}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Vacations;