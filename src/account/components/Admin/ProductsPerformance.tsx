// src/account/components/Admin/ProductsPerformance.tsx
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
import RefreshIcon from '@mui/icons-material/Refresh';
import { productsApi, Product } from '../../../services/productsApi';
import AdminLayout from '../layout/AdminLayout';
import './ProductsPerformance.css';

interface ProductSale {
  productId: string;
  productTitle: string;
  brand: string;
  soldCount: number;
  stockQuantity: number;
}

interface ChartDataPoint {
  date: string;
  count: number;
  sales: number;
}

const ProductsPerformance: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brandChartData, setBrandChartData] = useState<ChartDataPoint[]>([]);
  const [salesChartData, setSalesChartData] = useState<ChartDataPoint[]>([]);
  const [productStats, setProductStats] = useState<ProductSale[]>([]);
  const [filteredStats, setFilteredStats] = useState<ProductSale[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsApi.getAllProducts('approved', 1000, 0);
      if (response && response.products) {
        setProducts(response.products);
        
        // Generate sample chart data (since we don't have real sales data yet)
        const brandData = generateBrandChartData(response.products);
        setBrandChartData(brandData);
        
        const salesData = generateSalesChartData();
        setSalesChartData(salesData);
        
        // Generate product statistics
        const stats = response.products.map(product => ({
          productId: product.id,
          productTitle: product.title,
          brand: product.brand,
          soldCount: Math.floor(Math.random() * 100) + 10, // Sample sold count
          stockQuantity: product.stockQuantity,
        }));
        setProductStats(stats);
        setFilteredStats(stats);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      // Use sample data if API fails
      generateSampleData();
    } finally {
      setLoading(false);
    }
  };

  const generateBrandChartData = (products: Product[]): ChartDataPoint[] => {
    // Group products by month/year based on creation date
    const grouped: { [key: string]: number } = {};
    
    products.forEach(product => {
      const date = new Date(product.createdAt);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      grouped[monthYear] = (grouped[monthYear] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count, sales: 0 }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const generateSalesChartData = (): ChartDataPoint[] => {
    // Sample sales data by month
    return [
      { date: '2024-01', count: 0, sales: 45 },
      { date: '2024-02', count: 0, sales: 62 },
      { date: '2024-03', count: 0, sales: 78 },
      { date: '2024-04', count: 0, sales: 85 },
      { date: '2024-05', count: 0, sales: 92 },
      { date: '2024-06', count: 0, sales: 88 },
      { date: '2024-07', count: 0, sales: 105 },
      { date: '2024-08', count: 0, sales: 112 },
      { date: '2024-09', count: 0, sales: 98 },
      { date: '2024-10', count: 0, sales: 120 },
      { date: '2024-11', count: 0, sales: 135 },
      { date: '2024-12', count: 0, sales: 150 },
    ];
  };

  const generateSampleData = () => {
    const sampleProducts: Product[] = [
      { id: '1', title: 'Gaming Laptop', brand: 'Dell', mainType: 'electronics', subType: 'laptops', description: '', longDescription: '', price: 1200, stockQuantity: 15, imgSrc: [], status: 'approved', employeeId: 'emp1', employeeName: 'John Doe', employeeEmail: 'john@example.com', createdAt: new Date('2024-01-15'), updatedAt: new Date() },
      { id: '2', title: 'Wireless Mouse', brand: 'Logitech', mainType: 'electronics', subType: 'accessories', description: '', longDescription: '', price: 45, stockQuantity: 50, imgSrc: [], status: 'approved', employeeId: 'emp1', employeeName: 'John Doe', employeeEmail: 'john@example.com', createdAt: new Date('2024-02-10'), updatedAt: new Date() },
      { id: '3', title: 'Mechanical Keyboard', brand: 'Corsair', mainType: 'electronics', subType: 'accessories', description: '', longDescription: '', price: 120, stockQuantity: 8, imgSrc: [], status: 'approved', employeeId: 'emp2', employeeName: 'Jane Smith', employeeEmail: 'jane@example.com', createdAt: new Date('2024-01-20'), updatedAt: new Date() },
    ];
    setProducts(sampleProducts);
    setBrandChartData(generateBrandChartData(sampleProducts));
    setSalesChartData(generateSalesChartData());
    setProductStats(sampleProducts.map(p => ({ productId: p.id, productTitle: p.title, brand: p.brand, soldCount: Math.floor(Math.random() * 100), stockQuantity: p.stockQuantity })));
    setFilteredStats(sampleProducts.map(p => ({ productId: p.id, productTitle: p.title, brand: p.brand, soldCount: Math.floor(Math.random() * 100), stockQuantity: p.stockQuantity })));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

  if (loading && products.length === 0) {
    return (
      <AdminLayout>
        <div className="products-performance-loading">
          <div className="spinner"></div>
          <p>Loading performance data...</p>
        </div>
      </AdminLayout>
    );
  }

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedStats = filteredStats.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredStats.length / rowsPerPage);

  return (
    <AdminLayout>
      <div className="products-performance-container">
        <div className="performance-header">
          <h1>Products Performance</h1>
          <button 
            className="refresh-btn" 
            onClick={fetchProducts} 
            disabled={loading}
            title="Refresh"
          >
            <RefreshIcon />
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="close-btn">×</button>
          </div>
        )}

        {/* Chart 1: Products Brand Performance */}
        <div className="chart-container">
          <h2>Products Uploaded Over Time</h2>
          <div className="chart-wrapper">
            {brandChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={brandChartData}>
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
              <div className="no-data-message">No data available to display chart</div>
            )}
          </div>
        </div>

        {/* Chart 2: Product Sales Performance */}
        <div className="chart-container">
          <h2>Product Sales Performance</h2>
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
          <div className="stats-header">
            <h2>Products Statistics</h2>
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
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Product Brand</th>
                  <th>Product Title</th>
                  <th className="align-right">Number Sold</th>
                  <th className="align-right">In Stock</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStats.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="empty-state">
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

export default ProductsPerformance;