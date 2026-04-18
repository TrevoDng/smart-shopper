// src/components/employee/MyPerformance.tsx
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
} from 'recharts';
import { productsApi, Product } from '../../../services/productsApi';
import './MyPerformance.css';
import EmployeeLayout from '../layout/EmployeeLayout';

interface ChartData {
  date: string;
  count: number;
  sales?: number;
}

interface ProductStat {
  title: string;
  sold: number;
  inStock: number;
}

const MyPerformance: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsChartData, setProductsChartData] = useState<ChartData[]>([]);
  const [salesChartData, setSalesChartData] = useState<ChartData[]>([]);
  const [productStats, setProductStats] = useState<ProductStat[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all products
      const response = await productsApi.getMyProducts(undefined, 1000, 0);
      if (response && response.products) {
        const allProducts = response.products;
        setProducts(allProducts);

        // Process products chart data (group by month/year)
        const productsByDate = groupProductsByDate(allProducts);
        setProductsChartData(productsByDate);

        // Process product stats
        const stats = allProducts.map(product => ({
          title: product.title,
          sold: 0, // soldCount not available in Product interface yet
          inStock: product.stockQuantity,
        }));
        setProductStats(stats);

        // Fetch sales data (sample data for now)
        const salesData = getSampleSalesData();
        setSalesChartData(salesData);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const groupProductsByDate = (products: Product[]): ChartData[] => {
    const grouped: { [key: string]: number } = {};
    
    products.forEach(product => {
      const date = new Date(product.createdAt);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      grouped[monthYear] = (grouped[monthYear] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const getSampleSalesData = (): ChartData[] => {
    return [
      { date: '2024-01', count: 0, sales: 5 },
      { date: '2024-02', count: 0, sales: 12 },
      { date: '2024-03', count: 0, sales: 8 },
      { date: '2024-04', count: 0, sales: 15 },
      { date: '2024-05', count: 0, sales: 22 },
      { date: '2024-06', count: 0, sales: 18 },
      { date: '2024-07', count: 0, sales: 25 },
      { date: '2024-08', count: 0, sales: 30 },
      { date: '2024-09', count: 0, sales: 28 },
      { date: '2024-10', count: 0, sales: 35 },
      { date: '2024-11', count: 0, sales: 42 },
      { date: '2024-12', count: 0, sales: 38 },
    ];
  };

  // Calculate approval rate
  const approvedCount = products.filter(p => p.status === 'approved').length;
  const pendingCount = products.filter(p => p.status === 'pending').length;
  const rejectedCount = products.filter(p => p.status === 'rejected').length;
  const totalProducts = products.length;
  const approvalRate = totalProducts > 0 ? Math.round((approvedCount / totalProducts) * 100) : 0;
  const pendingRate = totalProducts > 0 ? Math.round((pendingCount / totalProducts) * 100) : 0;

  if (loading) {
    return (
      <EmployeeLayout>
      <div className="performance-loading-container">
        <div className="spinner"></div>
        <p>Loading performance data...</p>
      </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
    <div className="performance-container">
      <h1 className="performance-title">My Performance</h1>

      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Total Products</h3>
            <p className="stat-number">{totalProducts}</p>
          </div>
        </div>
        <div className="stat-card stat-approved">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Approved</h3>
            <p className="stat-number">{approvedCount}</p>
          </div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>Pending</h3>
            <p className="stat-number">{pendingCount}</p>
          </div>
        </div>
        <div className="stat-card stat-rejected">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <h3>Rejected</h3>
            <p className="stat-number">{rejectedCount}</p>
          </div>
        </div>
      </div>

      {/* Performance Summary Bars */}
      <div className="performance-summary">
        <h2>Performance Summary</h2>
        <div className="performance-bars">
          <div className="performance-item">
            <div className="performance-label">Approval Rate</div>
            <div className="performance-value">{approvalRate}%</div>
            <div className="progress-bar">
              <div 
                className="progress-fill approved" 
                style={{ width: `${approvalRate}%` }}
              />
            </div>
          </div>
          <div className="performance-item">
            <div className="performance-label">Pending Rate</div>
            <div className="performance-value">{pendingRate}%</div>
            <div className="progress-bar">
              <div 
                className="progress-fill pending" 
                style={{ width: `${pendingRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Chart */}
      <div className="chart-container">
        <h2>Products Uploaded Over Time</h2>
        <div className="chart-wrapper">
          {productsChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={productsChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  name="Products Uploaded"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data-message">
              <p>No product data available to display chart</p>
            </div>
          )}
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
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#82ca9d"
                name="Number of Sales"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Products Statistics Table */}
      <div className="stats-table-container">
        <h2>Products Statistics</h2>
        <div className="table-wrapper">
          <table className="stats-table">
            <thead>
              <tr>
                <th>Product Title</th>
                <th className="align-right">Number Sold</th>
                <th className="align-right">In Stock</th>
              </tr>
            </thead>
            <tbody>
              {productStats.length === 0 ? (
                <tr>
                  <td colSpan={3} className="empty-state">
                    <p>No products found</p>
                  </td>
                </tr>
              ) : (
                productStats.map((stat, index) => (
                  <tr key={index}>
                    <td className="product-title-cell">{stat.title}</td>
                    <td className="align-right">
                      <span className="sold-count">{stat.sold}</span>
                    </td>
                    <td className="align-right">
                      <span className={`stock-count ${stat.inStock === 0 ? 'out-of-stock' : ''}`}>
                        {stat.inStock}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </EmployeeLayout>
  );
};

export default MyPerformance;