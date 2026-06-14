import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Vacation, VacationsResponse } from '../../types';
import { api, vacationsAPI } from '../../services/api';
import { VacationCard } from '../Vacations';

const AdminVacations: React.FC = () => {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVacations = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await vacationsAPI.getVacations(page, 'all');
      const data: VacationsResponse = response.data;
      
      setVacations(data.vacations);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch vacations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacations();
  }, []);

  const handlePageChange = (page: number) => {
    fetchVacations(page);
  };

  const handleEdit = (vacation: Vacation) => {
    // Navigate to edit page
    window.location.href = `/admin/vacations/edit/${vacation.vacation_id}`;
  };

  const handleDelete = async (vacationId: number) => {
    try {
      await vacationsAPI.deleteVacation(vacationId);
      // Refresh the current page
      fetchVacations(currentPage);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete vacation');
    }
  };

  if (loading) {
    return <div className="loading">Loading vacations...</div>;
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Manage Vacations</h1>
        <Link to="/admin/vacations/add" className="btn btn-primary">
          Add New Vacation
        </Link>
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
                onLikeToggle={() => {}} // No like functionality for admin
                showLikeButton={false}
                showAdminActions={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={currentPage === page ? 'active' : ''}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
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

export default AdminVacations;
