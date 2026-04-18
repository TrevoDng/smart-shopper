// src/account/components/Admin/EmployeesPerformance.tsx
import React, { useState, useEffect } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import AdminLayout from '../layout/AdminLayout';
import './EmployeesPerformance.css';

interface EmployeeProduct {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  productId: string;
  productTitle: string;
  stockQuantity: number;
  soldCount: number;
  status: string;
}

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const EmployeesPerformance: React.FC = () => {
  const [employeeProducts, setEmployeeProducts] = useState<EmployeeProduct[]>([]);
  const [filteredData, setFilteredData] = useState<EmployeeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchEmployeeProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/employees-performance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        const productsList = data.data || [];
        setEmployeeProducts(productsList);
        setFilteredData(productsList);
      } else {
        setError(data.message || 'Failed to fetch employee performance data');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      // Use sample data if API is not ready
      setEmployeeProducts(sampleData);
      setFilteredData(sampleData);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for when API is not ready
  const sampleData: EmployeeProduct[] = [
    {
      id: '1',
      employeeId: 'emp1',
      employeeName: 'John Doe',
      employeeEmail: 'john@example.com',
      productId: 'prod1',
      productTitle: 'Gaming Laptop',
      stockQuantity: 15,
      soldCount: 42,
      status: 'approved'
    },
    {
      id: '2',
      employeeId: 'emp1',
      employeeName: 'John Doe',
      employeeEmail: 'john@example.com',
      productId: 'prod2',
      productTitle: 'Wireless Mouse',
      stockQuantity: 50,
      soldCount: 128,
      status: 'approved'
    },
    {
      id: '3',
      employeeId: 'emp2',
      employeeName: 'Jane Smith',
      employeeEmail: 'jane@example.com',
      productId: 'prod3',
      productTitle: 'Mechanical Keyboard',
      stockQuantity: 8,
      soldCount: 95,
      status: 'approved'
    },
    {
      id: '4',
      employeeId: 'emp2',
      employeeName: 'Jane Smith',
      employeeEmail: 'jane@example.com',
      productId: 'prod4',
      productTitle: 'USB-C Hub',
      stockQuantity: 25,
      soldCount: 67,
      status: 'approved'
    },
    {
      id: '5',
      employeeId: 'emp3',
      employeeName: 'Mike Johnson',
      employeeEmail: 'mike@example.com',
      productId: 'prod5',
      productTitle: 'Monitor 27"',
      stockQuantity: 3,
      soldCount: 31,
      status: 'approved'
    }
  ];

  useEffect(() => {
    fetchEmployeeProducts();
  }, []);

  useEffect(() => {
    const filtered = employeeProducts.filter(item =>
      item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setPage(0);
  }, [searchTerm, employeeProducts]);

  // Calculate employee totals
  const employeeTotals = filteredData.reduce((acc, item) => {
    if (!acc[item.employeeId]) {
      acc[item.employeeId] = {
        employeeName: item.employeeName,
        employeeEmail: item.employeeEmail,
        totalProducts: 0,
        totalSold: 0,
        totalInStock: 0
      };
    }
    acc[item.employeeId].totalProducts++;
    acc[item.employeeId].totalSold += item.soldCount;
    acc[item.employeeId].totalInStock += item.stockQuantity;
    return acc;
  }, {} as Record<string, { employeeName: string; employeeEmail: string; totalProducts: number; totalSold: number; totalInStock: number }>);

  const employeeSummary = Object.values(employeeTotals);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading && employeeProducts.length === 0) {
    return (
      <AdminLayout>
        <div className="performance-loading-container">
          <div className="spinner"></div>
          <p>Loading employee performance data...</p>
        </div>
      </AdminLayout>
    );
  }

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <AdminLayout>
      <div className="employees-performance-container">
        <div className="performance-header">
          <h1>Employee Performance</h1>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by employee or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button 
              className="refresh-btn" 
              onClick={fetchEmployeeProducts} 
              disabled={loading}
              title="Refresh"
            >
              <RefreshIcon />
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="close-btn">×</button>
          </div>
        )}

        {/* Employee Summary Cards */}
        <div className="employee-summary-cards">
          {employeeSummary.map((emp) => (
            <div key={emp.employeeEmail} className="summary-card">
              <div className="card-header">
                <div className="employee-avatar">
                  {emp.employeeName.charAt(0)}
                </div>
                <div className="employee-info">
                  <h3>{emp.employeeName}</h3>
                  <p>{emp.employeeEmail}</p>
                </div>
              </div>
              <div className="card-stats">
                <div className="stat">
                  <span className="stat-value">{emp.totalProducts}</span>
                  <span className="stat-label">Products</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{emp.totalSold}</span>
                  <span className="stat-label">Sold</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{emp.totalInStock}</span>
                  <span className="stat-label">In Stock</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Products Table */}
        <div className="table-container">
          <h2>Products by Employee</h2>
          <table className="performance-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Product Title</th>
                <th className="align-right">Number Sold</th>
                <th className="align-right">In Stock</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty-state">
                    <p>No products found</p>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.id}>
                    <td className="employee-cell">
                      <div className="employee-details">
                        <strong>{item.employeeName}</strong>
                        <small>{item.employeeEmail}</small>
                      </div>
                    </td>
                    <td className="product-cell">{item.productTitle}</td>
                    <td className="align-right">
                      <span className="sold-count">{item.soldCount}</span>
                    </td>
                    <td className="align-right">
                      <span className={`stock-count ${item.stockQuantity === 0 ? 'out-of-stock' : ''}`}>
                        {item.stockQuantity}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredData.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} products
            </div>
            <div className="pagination-controls">
              <select 
                value={rowsPerPage} 
                onChange={handleChangeRowsPerPage}
                className="rows-per-page"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
              <div className="page-buttons">
                <button
                  onClick={() => handleChangePage(page - 1)}
                  disabled={page === 0}
                  className="page-btn"
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => handleChangePage(page + 1)}
                  disabled={page + 1 >= totalPages}
                  className="page-btn"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default EmployeesPerformance;