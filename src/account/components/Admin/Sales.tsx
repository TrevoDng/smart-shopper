// src/account/components/Admin/Sales.tsx
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import RefreshIcon from '@mui/icons-material/Refresh';
import { productsApi, Product } from '../../../services/productsApi';
import AdminLayout from '../layout/AdminLayout';
import './Sales.css';

interface SalesDataPoint {
  date: string;
  sales: number;
  revenue: number;
}

interface ProductSale {
  productId: string;
  productTitle: string;
  brand: string;
  soldCount: number;
  stockQuantity: number;
  revenue: number;
}

const Sales: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [salesChartData, setSalesChartData] = useState<SalesDataPoint[]>([]);
  const [productStats, setProductStats] = useState<ProductSale[]>([]);
  const [filteredStats, setFilteredStats] = useState<ProductSale[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [timeRange, setTimeRange] = useState<'year' | '6months' | '3months'>('year');

  const generateSalesData = (): SalesDataPoint[] => {
    const allData = [
      { date: '2024-01', sales: 45, revenue: 22500 },
      { date: '2024-02', sales: 62, revenue: 31000 },
      { date: '2024-03', sales: 78, revenue: 39000 },
      { date: '2024-04', sales: 85, revenue: 42500 },
      { date: '2024-05', sales: 92, revenue: 46000 },
      { date: '2024-06', sales: 88, revenue: 44000 },
      { date: '2024-07', sales: 105, revenue: 52500 },
      { date: '2024-08', sales: 112, revenue: 56000 },
      { date: '2024-09', sales: 98, revenue: 49000 },
      { date: '2024-10', sales: 120, revenue: 60000 },
      { date: '2024-11', sales: 135, revenue: 67500 },
      { date: '2024-12', sales: 150, revenue: 75000 },
    ];

    if (timeRange === '3months') {
      return allData.slice(-3);
    } else if (timeRange === '6months') {
      return allData.slice(-6);
    }
    return allData;
  };

  const fetchSalesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsApi.getAllProducts('approved', 1000, 0);
      if (response && response.products) {
        setProducts(response.products);
        
        setSalesChartData(generateSalesData());
        
        // Generate product sales statistics with sample data
        const stats = response.products.map(product => ({
          productId: product.id,
          productTitle: product.title,
          brand: product.brand,
          soldCount: Math.floor(Math.random() * 150) + 10,
          stockQuantity: product.stockQuantity,
          revenue: (Math.floor(Math.random() * 150) + 10) * product.price,
        }));
        
        // Sort by sold count descending
        stats.sort((a, b) => b.soldCount - a.soldCount);
        
        setProductStats(stats);
        setFilteredStats(stats);
      } else {
        setError('Failed to fetch sales data');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setSalesChartData(generateSalesData());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  useEffect(() => {
    setSalesChartData(generateSalesData());
  }, [timeRange]);

  useEffect(() => {
    const filtered = productStats.filter(stat =>
      stat.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stat.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStats(filtered);
    setPage(0);
  }, [searchTerm, productStats]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate totals
  const totalSales = salesChartData.reduce((sum, d) => sum + d.sales, 0);
  const totalRevenue = salesChartData.reduce((sum, d) => sum + d.revenue, 0);
  const averageSales = totalSales / salesChartData.length;

  
  // Top selling products
  const topProducts = productStats.slice(0, 5);
  
  // Pie chart data for top categories
  const pieData = topProducts.map(p => ({
    name: p.productTitle.length > 15 ? p.productTitle.substring(0, 15) + '...' : p.productTitle,
    value: p.soldCount,
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

  if (loading && products.length === 0) {
    return (
      <AdminLayout>
        <div className="sales-loading">
          <div className="spinner"></div>
          <p>Loading sales data...</p>
        </div>
      </AdminLayout>
    );
  }

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedStats = filteredStats.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredStats.length / rowsPerPage);
const percent = 10;

  return (
    <AdminLayout>
      <div className="sales-container">
        <div className="sales-header">
          <h1>Sales Analytics</h1>
          <div className="header-actions">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="time-range-select"
            >
              <option value="year">Last 12 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="3months">Last 3 Months</option>
            </select>
            <button className="refresh-btn" onClick={fetchSalesData} disabled={loading}>
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

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Total Revenue</h3>
              <p className="stat-value">R{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>Total Sales</h3>
              <p className="stat-value">{totalSales.toLocaleString()}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Average Monthly Sales</h3>
              <p className="stat-value">{Math.round(averageSales).toLocaleString()}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏷️</div>
            <div className="stat-info">
              <h3>Products Sold</h3>
              <p className="stat-value">{productStats.length}</p>
            </div>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="chart-container">
          <h2>Sales Performance</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  name="Units Sold"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#82ca9d"
                  name="Revenue (R)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Two Column Layout for Charts */}
        <div className="charts-two-column">
          <div className="chart-container half">
            <h2>Top Selling Products</h2>
            <div className="chart-wrapper small">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="productTitle" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="soldCount" fill="#8884d8" name="Units Sold" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-container half">
            <h2>Sales Distribution</h2>
            <div className="chart-wrapper small">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => {
    const percentage = percent !== undefined ? (percent * 100).toFixed(0) : 
                       pieData.length > 0 ? ((value / pieData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(0) : '0';
    return `${name}: ${percentage}%`;
  }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Products Sales Table */}
        <div className="stats-table-container">
          <div className="stats-header">
            <h2>Product Sales Details</h2>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by product or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="table-wrapper">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Product Brand</th>
                  <th>Product Title</th>
                  <th className="align-right">Number Sold</th>
                  <th className="align-right">In Stock</th>
                  <th className="align-right">Revenue (R)</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStats.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-state">
                      <p>No products found</p>
                    </td>
                  </tr>
                ) : (
                  paginatedStats.map((stat) => (
                    <tr key={stat.productId}>
                      <td className="brand-cell">{stat.brand}</td>
                      <td className="product-cell">{stat.productTitle}</td>
                      <td className="align-right">
                        <span className="sold-count">{stat.soldCount}</span>
                      </td>
                      <td className="align-right">
                        <span className={`stock-count ${stat.stockQuantity === 0 ? 'out-of-stock' : ''}`}>
                          {stat.stockQuantity}
                        </span>
                      </td>
                      <td className="align-right">
                        <span className="revenue">R{stat.revenue.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredStats.length > 0 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredStats.length)} of {filteredStats.length} products
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
      </div>
    </AdminLayout>
  );
};

export default Sales;