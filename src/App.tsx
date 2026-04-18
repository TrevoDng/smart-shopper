import React, { useState, createContext, useEffect } from 'react';
//import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './account/context/AuthContext'; //from './contexts/AuthContext';
import AccountProfile from './account/components/customer/CustomerAccountProfile';

//import Slider from './slider/Slider';
import Slider from './slider/new-slider/Slider';
import { SliderProvider, useSlider } from './slider/slidercontext/SliderContext';
import PageNotFound from './pagenotfound/pagenotfound';
import CategoryFilter from './itemsComponents/products/category-filter/CategoryFilter';
import { combinedProducts, mostBoughtItems } from './itemsComponents/products/data/demoData';
import { FooterComponent } from './footer/Footer';
import { ProductCategory } from './itemsComponents/products/types/Product';
import TopNavbar from './nav/TopNavbar';
import Footers from './footer/Footers';
// import FilterSection from './itemsComponents/products/aside-filter-section/FilterSection';

import './App.css';
import './itemsComponents/products/ProductsPage.css';
import RandomProductsPage from './itemsComponents/products/random-products-grid/RandomProductsPage';
import WishListGrid from './itemsComponents/products/wish-list/components/wish-list-grid/WishListGrid';
import { WishlistProvider } from './itemsComponents/products/wish-list/context/WishlistContext';
import SingleOpenedProductPage from './itemsComponents/products/single-opened-product/SingleOpenedProductPage';
import { BackButton } from './itemsComponents/products/back-button/BackButton';
import SearchProductsGrid from './search/SearchProductsGrid';
import CartlistGrid from './itemsComponents/products/cart/components/CartlistGrid';
import { CartlistProvider } from './itemsComponents/products/cart/context/CartlistContext';
import TypeFilter from './itemsComponents/products/aside-filter-section/TypeFilter';
import RandomProductsGrid from './itemsComponents/products/random-products-grid/RandomProductsGrid';
import RandomProductsPageTwo from './itemsComponents/products/random-products-grid/RandomProductsTwo';
import Navbar from './nav/Navbar';
import MyComponent from './itemsComponents/products/MyComponent';
import ProductsPage from './itemsComponents/products/ProductsPage';
import ProductsCards from './itemsComponents/products/product-card/ProductsCads';
import CheckoutPage from './itemsComponents/products/cart/checkout/CheckoutPage';
import Cart from './itemsComponents/products/cart/components/cart-new/Cart';
import PaymentMethodSelector, { PaymentMethod } from './itemsComponents/products/cart/checkout/all-payments-options/PaymentMethodSelector';
import About from './about/About';
import Deals from './itemsComponents/products/deals/Deals';
import AddProduct from './account/components/Employee/AddProduct';
//import { UnifiedAuthProvider, useUnifiedAuth } from './styles/context/unifiedAuthContext';

// Auth components
//import RoleSelector from './components/Auth/RoleSelector';
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
import { ProductDataProvider, useProductData } from './itemsComponents/context/ProductDataContext';

const SliderConditionalRenderer: React.FC = () => {
	const { isSliderVisible } = useSlider();
	return isSliderVisible ? <Slider /> : null;
} 



interface RandomProductsPageProps {
  categories: ProductCategory[];
  searchedResults: ProductCategory[];
	setSearchQuery: (query: string)=> void;
	searchedQuery: string;
  onSelectedType: (type: string | null) => void;
  selectedItemId: string | null;
  selectedType: string | null;
  onItemId: (id: string) => void;
  onLoading: (id: string | null) => void;
  loading?: string | null; 
}

interface FilteredProductsProps {
	categories: ProductCategory[];
	searchedResults: ProductCategory[];
  onSelectedType: (type: string | null) => void;
  selectedItemId: string | null;
  selectedType: string | null;
  onItemId: (id: string) => void;
  onLoading: (id: string | null) => void;
  loading?: string | null;
}

//login functions

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
//end of login functions

const ProductMainPage: React.FC<RandomProductsPageProps> =({
	categories,
	searchedResults,
	setSearchQuery,
	searchedQuery,
    onSelectedType, 
	selectedItemId,
    selectedType,
    onItemId, 
    onLoading, 
    loading 
	})=> {

		return (
			<div>
			<div className='main-page-content'>
			<div className='products-main-container-cover'>

			{searchedQuery.length < 3 ?
				(<RandomProductsPage
						categories={categories}
						onSelectedType={onSelectedType} 
						selectedType={selectedType}
						onItemId={onItemId}
						onLoading={onLoading}
						loading={loading}
					/>) :
			 
				<RandomProductsPage
						categories={searchedResults}
						onSelectedType={onSelectedType} 
						selectedType={selectedType}
						onItemId={onItemId}
						onLoading={onLoading}
						loading={loading}
					/>}
			</div>
		</div>

			{/**most bought products */}
			<div className='most-bought-items-section'>
				<h2>Most bought items</h2>
				<div className='most-bought-items-container'>
					{categories.map(category => (
						category.models.map(product => (
							<ProductsCards
							key={product.id}
          product={{
            ...product,
            currency: product.currency,
            imgSrc: product.imgSrc,
          }}
          onItemId={onItemId}
          onSelectedType={onSelectedType}
          //setSearchQuery={setSearchQuery}
          //searchQuery={searchQuery}
          onLoading={onLoading}
          loading={loading} />
						))
					))}
				</div>
			</div>

			{/**payment options */}
			    <div className="payment-section">
        <h2>WE ACCEPT:</h2>
        <div className="payment-grid">
			<img src='https://firebasestorage.googleapis.com/v0/b/sipmab-9ab74.appspot.com/o/aisle-net%2Fpayments-icons.jpg?alt=media&token=f7ffcc18-b89e-47b3-a07d-e80ef2a7f9cc' />

			{/*
            <div className="payment-item visa">VISA
				<i className="fa-brands fa-google-pay"></i>
			</div>
            <div className="payment-item edgars">EDGARS</div>
            <div className="payment-item card">0000 0000 0000 0000</div>
            <div className="payment-item pay"><i className="fab fa-cc-visa"></i>
            </div>
            <div className="payment-item pay">
            <i className="fab fa-cc-apple-pay"></i></div>
            <div className="payment-item pay"><i className="fab fa-cc-mastercard"></i>
            </div>
            <div className="payment-item rcs">RCS</div>
            <div className="payment-item payjustnow"><i className="fab fa-cc-paypal"></i></div>
            <div className="payment-item xpayflex">Xpayflex</div>
            <div className="payment-item mobicred">mobicred</div>
            <div className="payment-item happypay">Happy Pay</div>
            <div className="payment-item bank">BANK</div>
            <div className="payment-item payby">pay by</div>
            <div className="payment-item zapper">zapper</div> */}
        </div>
    </div>
		</div>
		)
	}


	const CreatePaymentMethodSelector=()=> {

		const handleSelect=()=> {
			console.log("selected");
		}
		return (<PaymentMethodSelector 
					onSelect={handleSelect}
  					isOpen = {true}/>)
	}

interface ProductsComponentProps {
	category: ProductCategory[];

	searchedResults: ProductCategory[];
	setSearchQuery: (query: string)=> void;
	searchedQuery: string;
	selectedType: string | null;
	setSelectedType: (id: string | null)=> void;
	selectedItemId: string | null;
	setSelectedItemId: (id: string | null)=> void;
	setTypeById: (id: number | null)=> void;
	onLoading: (id: string | null)=> void;
	loading?: string | null;
}

const MainPageController: React.FC<ProductsComponentProps>=({
	category,
	searchedResults,
	setSearchQuery,
	searchedQuery,
	selectedType, 
	setSelectedType,
	selectedItemId, 
	setSelectedItemId,
	setTypeById,
	onLoading,
	loading, 
})=> {
		const [showCart, setShowCart] = useState(false);

const WishlistPage =()=> {
	return (
		
			<WishListGrid  
    				onItemId={setSelectedItemId}
    				onLoading={onLoading}
    				loading={loading} />			
	)
}

const CartlistPage=()=> {
	return (
		<Cart 
			onItemId={setSelectedItemId}
    		onLoading={onLoading}
    		loading={loading} />
	)
}


  return (
    	<Router>

			{ (selectedItemId) && 
		   ( <BackButton 
			  selectedType={selectedType}
			  selectedItemId={selectedItemId}
			  onItemId={setSelectedItemId}
			  onSelectedType={setSelectedType}
			  onTypeById={setTypeById}
			  onShowCart={setShowCart}
			  showCart={showCart}
			/>)
			}

		<Routes>
		<Route path="/" element={<ProductMainPage 
		categories={category}
		searchedResults={searchedResults}
		setSearchQuery={setSearchQuery}
		searchedQuery={searchedQuery}
				onSelectedType={setSelectedType} 
          selectedType={selectedType}   
          onItemId={setSelectedItemId} 
		  selectedItemId={selectedItemId}
          onLoading={onLoading}
          loading={loading}/>} />

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
		{
		<Route path='/single-product-page/:id' element={<SingleOpenedProductPage 
    		itemsData={category} itemId={selectedItemId} setSelectedItemId={setSelectedItemId}/>} />
	}
	{/*
		<Route path='/categories' element={<FilteredProductsPage 
			categories={combinedProducts}
			searchedResults={searchedResults}
			onSelectedType={setSelectedType}
			selectedType={selectedType}
			onItemId={setSelectedItemId}
			selectedItemId={selectedItemId}
			onLoading={onLoading}
			loading={loading}/>} />
			*/}
		
		<Route path='/add-product' element={<AddProduct />} />
		<Route path='/wishlist' element={<WishlistPage />} />
		<Route path='/cart' element={<CartlistPage />} />
		<Route path='/checkout' element={<CreatePaymentMethodSelector />} />
		<Route path='/deals' element={<Deals />} />
		<Route path='/about' element={<About />} />
		<Route path="*" element={<PageNotFound />} />
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
}

// This is the inner component that uses the product data
const AppContent: React.FC = () => {
	const [selectedType, setSelectedType] = useState<string | null>(null);
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
	const [typeById, setTypeById] = useState<number | null>(null);
	const [showSingleItem, setShowSingleItem] = useState(false);
    const [searchQuery, setSearchQuery] = React.useState<string>('');
	const [loadingDelay, setLoadingDelay] = useState<string | null>(null);

	const { id } = useParams();
	
	// Get real data from database - NOW THIS WORKS because we're inside the provider
	const { categories: dbCategories, loading: dbLoading, error: dbError } = useProductData();
	const [searchResults, setSearchResults] = useState<ProductCategory[]>([]);

	// Set selected item ID from URL params
	useEffect(() => {
		if (id) {
			setSelectedItemId(id);
		}
	}, [id]);

	// Search function using real data
	useEffect(() => {
		const performSearch = async () => {
			if (searchQuery.length < 2) {
				setSearchResults([]);
				return;
			}
			
			// Search through real database products
			const allProducts = dbCategories.flatMap(cat => cat.models);
			const searchTerm = searchQuery.toLowerCase().trim();
			
			const filteredModels = allProducts.filter(product => 
				product.title.toLowerCase().includes(searchTerm) ||
				product.brand.toLowerCase().includes(searchTerm) ||
				product.description.toLowerCase().includes(searchTerm)
			);
			
			// Group by type/category
			const categoryMap = new Map<string, ProductCategory>();
			filteredModels.forEach(product => {
				if (!categoryMap.has(product.type)) {
					const originalCat = dbCategories.find(cat => cat.type === product.type);
					categoryMap.set(product.type, {
						type: product.type,
						icon: originalCat?.icon || '',
						title: originalCat?.title || product.type,
						typeId: originalCat?.typeId || categoryMap.size + 1,
						models: []
					});
				}
				categoryMap.get(product.type)!.models.push(product);
			});
			
			setSearchResults(Array.from(categoryMap.values()));
		};
		
		performSearch();
	}, [searchQuery, dbCategories]);

	// Show loading state while fetching database products
	if (dbLoading) {
		return (
			<div className="loading-container" style={{ textAlign: 'center', padding: '50px' }}>
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
				<p>Loading products from database...</p>
			</div>
		);
	}

	if (dbError) {
		return (
			<div className="error-container" style={{ textAlign: 'center', padding: '50px' }}>
				<h2>Error Loading Products</h2>
				<p>{dbError}</p>
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
								<main className='main-content-container'>
									<AuthProvider>
										<MainPageController 
											category={dbCategories}  
											searchedResults={searchResults}
											setSearchQuery={setSearchQuery}
											searchedQuery={searchQuery}
											selectedType={selectedType} 
											setSelectedType={setSelectedType}
											selectedItemId={selectedItemId}
											setSelectedItemId={setSelectedItemId}
											setTypeById={setTypeById}
											onLoading={setLoadingDelay}
											loading={loadingDelay}
											// Pass dbCategories here
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

// This is the outer component that provides the product data
const App: React.FC = () => {
	return (
		<ProductDataProvider>
			<AppContent />
		</ProductDataProvider>
	);
};

export default App;

/**
 * 
	const searchProducts =(query: string, products: ProductCategory[]): ProductCategory[] => {
		if(query.length <= 2) return [];

		const searchTerm = query.toLowerCase().trim();

		return products.map(product => {
			const categoryMatch = [product.type, product.title].some(field => 
				field.toLowerCase().includes(searchTerm)
			);

			const modelMatch = product.models.filter(model => [model.type, model.model, model.description /*, model.longDescription*///]
			//	.some(field => field.toLowerCase().includes(searchTerm))
			//);

			/*
			if(categoryMatch) {
				return { ...product, models: product.models }
		<Route path='/products' element={<ProductMainMapge />} />
			}

			if (modelMatch.length > 0) {
				return { ...product, models: modelMatch }
			}

			return null;
*/
/*
			return categoryMatch || modelMatch.length > 0 
			? {...product, models: categoryMatch ? product.models : modelMatch} 
			: null; 
		})
		.filter(Boolean) as ProductCategory[];
	};
 */