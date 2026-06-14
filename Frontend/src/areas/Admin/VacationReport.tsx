import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ReportData } from '../../types';
import { api, vacationsAPI } from '../../services/api';

const VacationReport: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await vacationsAPI.getVacationReport();
        setReportData(response.data);
        setError('');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch report data');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const downloadCSV = () => {
    const csvContent = [
      ['Destination', 'Likes Count'],
      ...reportData.map(item => [item.destination, item.likes_count.toString()])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'vacation_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="loading">Loading report...</div>;
  }

  return (
    <div>
      <div className="report-header">
        <h1>Vacation Report</h1>
        <button onClick={downloadCSV} className="btn btn-success">
          Download CSV
        </button>
      </div>
      
      {error && <div className="alert alert-error">{error}</div>}

      {reportData.length === 0 ? (
        <div className="loading">No data available</div>
      ) : (
        <div>
          <div className="report-chart-container">
            <h3>Vacation Likes Chart</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={reportData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="destination" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="likes_count" fill="#3498db" name="Number of Likes" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3>Report Data</h3>
            <div className="report-table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Destination</th>
                    <th>Likes Count</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.destination}</td>
                      <td>{item.likes_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VacationReport;
