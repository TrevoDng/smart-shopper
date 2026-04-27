import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './account/context/AuthContext';
import AccountProfile from './account/components/customer/CustomerAccountProfile';
import Slider from './slider/new-slider/Slider';
import { SliderProvider, useSlider } from './slider/slidercontext/SliderContext';
import PageNotFound from './pagenotfound/pagenotfound';
import { FooterComponent } from './footer/Footer';
import { Product } from './itemsComponents/products/types/Product';
import TopNavbar from './nav/TopNavbar';
import Footers from './footer/Footers';
import './App.css';
import RandomProductsPage from './itemsComponents/products/random-products-grid/RandomProductsPage';
import WishListGrid from './itemsComponents/products/wish-list/components/wish-list-grid/WishListGrid';
import { WishlistProvider } from './itemsComponents/products/wish-list/context/WishlistContext';
import SingleOpenedProductPage from './itemsComponents/products/single-opened-product/SingleOpenedProductPage';
import { BackButton } from './itemsComponents/products/back-button/BackButton';
import { CartlistProvider } from './itemsComponents/products/cart/context/CartlistContext';
import ProductsCards from './itemsComponents/products/product-card/ProductsCads';
import Cart from './itemsComponents/products/cart/components/cart-new/Cart';
import PaymentMethodSelector from './itemsComponents/products/cart/checkout/all-payments-options/PaymentMethodSelector';
import About from './about/About';
import Deals from './itemsComponents/products/deals/Deals';
import AddProduct from './account/components/Employee/AddProduct';

// Auth components
import CustomerLogin from './account/components/Auth/customer/CustomerLogin'; 
import CustomerRegister from './account/components/Auth/customer/CustomerRegister';
import EmployeeLogin from './account/components/Auth/employee/EmployeeLogin';
import EmployeeRegister from './account/components/Auth/employee/EmployeeRegister';
import AdminLogin from './account/components/Auth/admin/AdminLogin';
import AdminManagement from './account/components/Admin/AdminManagement';
import AdminSetup from './account/components/Admin/AdminSetup';
import EmployeeMainPage from './account/components/Employee/EmployeeMainPage';
import AdminMainPage from './account/components/Admin/AdminMainPage';
import { ThemeProvider } from './styles/context/ThemeContext';
import './styles/themes.css';

// Protected routes
import AdminDashboard from './account/components/Admin/AdminDashboard';
import EmployeeDashboard from './account/components/Employee/EmployeeDashboard';
import EmployeeAccountProfile from './account/components/Employee/EmployeeAccountProfile';
import MyProducts from './account/components/Employee/MyProducts';
import MyPerformance from './account/components/Employee/MyPerformance';
import EmployeeEnquiries from './account/components/Employee/EmployeeEnquiries';
import EmployeeSuggestions from './account/components/Employee/EmployeeSuggestions';
import ProductsSales from './account/components/Employee/ProductsSales';
import RegistrationRequests from './account/components/Admin/RegistrationRequests';
import PendingProducts from './account/components/Admin/PendingProducts';
import Clients from './account/components/Admin/Clients';
import Employees from './account/components/Admin/Employees';
import EmployeesPerformance from './account/components/Admin/EmployeesPerformance';
import Products from './account/components/Admin/Products';
import ProductsPerformance from './account/components/Admin/ProductsPerformance';
import OutOfStock from './account/components/Admin/OutOfStock';
import Enquiries from './account/components/Admin/Enquiries';
import Suggestions from './account/components/Admin/Suggestions';
import AdminAccountProfile from './account/components/Admin/AdminAccountProfile';
import Sales from './account/components/Admin/Sales';
import ProductPage from './itemsComponents/products/random-products-grid/ProductPage';
import { productsApi } from './services/productsApi';
import { useDiscounts } from './hooks/useDiscounts';
import CategoryMainFilter from './itemsComponents/products/category-filter/CategoryMainFilter';

const SliderConditionalRenderer: React.FC = () => {
  const { isSliderVisible } = useSlider();
  return isSliderVisible ? <Slider /> : null;
};

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600">loading</div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Public route component (redirects if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/account" /> : <>{children}</>;
};

interface ProductMainPageProps {
  products: Product[];
  searchedResults: Product[];
  resultsMatch: boolean;
  onDiscountedPrice: (productId: string, originalPrice: number) => { discountedPrice: number, discountAmount: number } | null;
  fetchDiscounts: (id: string[]) => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchedQuery: string;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedItemId: string | null;
  onItemId: (id: string) => void;
  onLoading: (id: string | null) => void;
  loading?: string | null;
}

const ProductMainPage: React.FC<ProductMainPageProps> = ({
  products,
  searchedResults,
  resultsMatch,
  onDiscountedPrice,
  fetchDiscounts,
  setSearchQuery,
  searchedQuery,
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
  priceRange,
  setPriceRange,
  selectedItemId,
  onItemId,
  onLoading,
  loading,
}) => {
  return (
    <div>
      <div className='main-page-content'>
        <div className='products-main-container-cover'>
          {searchedQuery.length < 3 ? (
            <ProductPage
              products={products}
              searchedQuery={searchedQuery}
              setSearchQuery={setSearchQuery}
              resultsMatch={resultsMatch}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              onDiscountedPrice={onDiscountedPrice}
              fetchDiscounts={fetchDiscounts}
              onItemId={onItemId}
              onLoading={onLoading}
              loading={loading}
            />
          ) : (
                        <ProductPage
              products={searchedResults}
              setSearchQuery={setSearchQuery}
              searchedQuery={searchedQuery}
              searchedResults={searchedResults}
              resultsMatch={resultsMatch}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              onDiscountedPrice={onDiscountedPrice}
              fetchDiscounts={fetchDiscounts}
              onItemId={onItemId}
              onLoading={onLoading}
              loading={loading}
            />
          )}
        </div>
      </div>

      {/* Most bought products */}
      <div className='most-bought-items-section'>
        <h2>Most bought items</h2>
        <div className='most-bought-items-container'>
          {products.slice(0, 6).map(product => (
            <ProductsCards
              key={product.id}
              product={{
                ...product,
                currency: product.currency,
                imgSrc: product.imgSrc,
              }}
              onItemId={onItemId}
              onLoading={onLoading}
              loading={loading}
            />
          ))}
        </div>
      </div>

      {/* Payment options */}
      <div className="payment-section">
        <h2>WE ACCEPT:</h2>
        <div className="payment-grid">
            <i className="fab fa-cc-visa"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-paypal"></i>
            <i className="fab fa-cc-apple-pay"></i>
        </div>
      </div>
    </div>
  );
};

const CreatePaymentMethodSelector = () => {
  const handleSelect = () => {
    console.log("selected");
  };
  return <PaymentMethodSelector onSelect={handleSelect} isOpen={true} />;
};

interface MainPageControllerProps {
  products: Product[];
  searchedResults: Product[];
  resultsMatch: boolean;
  onDiscountedPrice: (productId: string, originalPrice: number) => { discountedPrice: number, discountAmount: number } | null;
  fetchDiscounts: (id: string[]) => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchedQuery: string;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  setTypeById: (id: number | null) => void;
  onLoading: (id: string | null) => void;
  loading?: string | null;
}

const MainPageController: React.FC<MainPageControllerProps> = ({
  products,
  searchedResults,
  resultsMatch,
  onDiscountedPrice,
  fetchDiscounts,
  setSearchQuery,
  searchedQuery,
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
  priceRange,
  setPriceRange,
  selectedItemId,
  setSelectedItemId,
  setTypeById,
  onLoading,
  loading,
}) => {
  const [showCart, setShowCart] = useState(false);

  const WishlistPage = () => {
    return (
      <WishListGrid  
        onItemId={setSelectedItemId}
        onLoading={onLoading}
        loading={loading}
      />      
    );
  };

  const CartlistPage = () => {
    return (
      <Cart 
        onItemId={setSelectedItemId}
        onLoading={onLoading}
        loading={loading}
      />
    );
  };

  return (
    <Router>
      {selectedItemId && (
        <BackButton 
          selectedItemId={selectedItemId}
          onItemId={setSelectedItemId}
          onShowCart={setShowCart}
          showCart={showCart}
        />
      )}

      <Routes>
        <Route path="/" element={
          <ProductMainPage 
            products={products}
            searchedResults={searchedResults}
            resultsMatch={resultsMatch}
            onDiscountedPrice={onDiscountedPrice}
            fetchDiscounts={fetchDiscounts}
            setSearchQuery={setSearchQuery}
            searchedQuery={searchedQuery}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedItemId={selectedItemId}
            onItemId={setSelectedItemId}
            onLoading={onLoading}
            loading={loading}
          />
        } />

        <Route path='/login' element={
          <PublicRoute>
            <CustomerLogin />
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <CustomerRegister />
          </PublicRoute>
        } />
        
        <Route path="/account" element={
          <ProtectedRoute>
            <AccountProfile />
          </ProtectedRoute>
        } />
        
        <Route path='/single-product-page/:id' element={
          <SingleOpenedProductPage 
            itemsData={products}
            itemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
          />
        } />
        
        <Route path='/add-product' element={<AddProduct />} />
        <Route path='/wishlist' element={<WishlistPage />} />
        <Route path='/cart' element={<CartlistPage />} />
        <Route path='/checkout' element={<CreatePaymentMethodSelector />} />
        <Route path='/deals' element={<Deals />} />
        <Route path='/about' element={<About />} />
        <Route path="*" element={<PageNotFound />} />
        
        {/* Employee Routes */}
        <Route path="/login/employee" element={<EmployeeLogin />} />	
        <Route path="/register/employee" element={<EmployeeRegister />} />
        <Route path="/employee/account-profile" element={<EmployeeAccountProfile />} />
        <Route path="/employee/add-product" element={<AddProduct />} />
        <Route path="/employee/my-products" element={<MyProducts />} />
        <Route path='/employee/products-sales' element={<ProductsSales />} />
        <Route path="/employee/my-performance" element={<MyPerformance />} />
        <Route path='/employee/mainpage' element={<EmployeeMainPage />} />
        <Route path='/employee/dashboard' element={<EmployeeDashboard />} />
        <Route path="/employee/enquiries" element={<EmployeeEnquiries />} />
        <Route path="/employee/suggestions" element={<EmployeeSuggestions />} />
        
        {/* Admin Routes */}
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/mainpage' element={<AdminMainPage />} />
        <Route path='/admin/management' element={<AdminManagement />} />
        <Route path='/admin/setup' element={<AdminSetup />} />
        <Route path='/admin/registration-requests' element={<RegistrationRequests />} />
        <Route path='/admin/pending-products' element={<PendingProducts />} />
        <Route path='/admin/clients' element={<Clients />} />
        <Route path='/admin/employees' element={<Employees />} />
        <Route path='/admin/employee-performance' element={<EmployeesPerformance />} />
        <Route path='/admin/products' element={<Products />} />
        <Route path='/admin/products-performance' element={<ProductsPerformance />} />
        <Route path='/admin/products-sales' element={<Sales />} />
        <Route path='/admin/out-of-stock' element={<OutOfStock />} />
        <Route path='/admin/enquiries' element={<Enquiries />} />
        <Route path='/admin/suggestions' element={<Suggestions />} />
        <Route path='/admin/admin-profile' element={<AdminAccountProfile />} />
        
        <Route path="/login" element={<CustomerLogin />} />
      </Routes>
    </Router>
  );
};

// Main AppContent component - Single source of truth for all state
const AppContent: React.FC = () => {
  // Product data states
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [resultsMatch, setResultsMatch] = useState<boolean>(true);
  //let resultsMatch = true;
  // Filter states - ALL STATE LIVES HERE (single source of truth)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  
  // UI states
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [typeById, setTypeById] = useState<number | null>(null);
  const [loadingDelay, setLoadingDelay] = useState<string | null>(null);
  
  const { getDiscountedPrice, fetchDiscounts } = useDiscounts();
  const { id } = useParams();

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await productsApi.getPublicApprovedProducts();
        const transformedProducts = response.products.map(product => ({
          ...product,
          price: String(product.price)
        }));
        setProducts(transformedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Set selected item ID from URL params
  useEffect(() => {
    if (id) {
      setSelectedItemId(id);
    }
  }, [id]);

  // Search function
  useEffect(() => {
    const performSearch = () => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }
      
      const searchTerm = searchQuery.toLowerCase().trim();
      const filtered = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.some(cat => cat.toLowerCase().includes(searchTerm))
      );
      
      setSearchResults(filtered);

       // Set resultsMatch based on whether we found anything
    if (searchTerm.length >= 3 && filtered.length === 0) {
       //resultsMatch = false;
      setResultsMatch(false);

      console.log("Filtered results:", filtered, "for search term:", searchTerm);
    } else {
      //resultsMatch = true;
      setResultsMatch(true);
    }
    };

    
    performSearch();
  }, [searchQuery, products]);


  // Show loading state
  if (loading) {
    return (
      <div className="loading-container" style={{ textAlign: 'center', padding: '50px' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p>Loading products from database...</p>
      </div>
    );
  }

  /*
  if (searchQuery.length >= 2 && searchResults.length === 0) {
        resultsMatch = false;
    }
    */

  if (error) {
    return (
      <div className="error-container" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Error Loading Products</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <SliderProvider defaultVisible={true}>
          <div className='website-main-container'>
            <CartlistProvider>
              <WishlistProvider>
                <TopNavbar 
                  setSearchQuery={setSearchQuery}
                  searchQuery={searchQuery}
                  onItemId={setSelectedItemId}
                  onLoading={setLoadingDelay}
                  loading={loadingDelay}
                />
                
                <SliderConditionalRenderer />
                <CategoryMainFilter datas={products} selectedCategory={selectedCategories} onSelectedCategory={setSelectedCategories}/>
                <main className='main-content-container'>
                  <AuthProvider>
                    <MainPageController 
                      products={products}
                      searchedResults={searchResults}
                      resultsMatch={resultsMatch}
                      //setResultsMatch={setResultsMatch}
                      onDiscountedPrice={getDiscountedPrice}
                      fetchDiscounts={fetchDiscounts}
                      setSearchQuery={setSearchQuery}
                      searchedQuery={searchQuery}
                      selectedCategories={selectedCategories}
                      setSelectedCategories={setSelectedCategories}
                      selectedBrands={selectedBrands}
                      setSelectedBrands={setSelectedBrands}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      selectedItemId={selectedItemId}
                      setSelectedItemId={setSelectedItemId}
                      setTypeById={setTypeById}
                      onLoading={setLoadingDelay}
                      loading={loadingDelay}
                    />
                  </AuthProvider>
                  <FooterComponent />
                  <Footers />
                </main>
              </WishlistProvider> 
            </CartlistProvider>
          </div>
        </SliderProvider> 
      </AuthProvider>
    </ThemeProvider>
  );
};

// Main App component
const App: React.FC = () => {
  return <AppContent />;
};

export default App;