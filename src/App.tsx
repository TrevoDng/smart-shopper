import React, { useState, createContext, useEffect } from 'react';
//import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './account/context/AuthContext'; //from './contexts/AuthContext';
import Login from './account/components/Login';
import Register from './account/components/Register'; 
import AccountProfile from './account/components/AccountProfile';
import ItemsMainComponent from './itemsComponents/itemsComponentContainer/ItemsMainComponent';

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
import SingleOpenedProductPage from './itemsComponents/products/single-opened-product/SingleOpendProductPage';
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
import AddProduct from './pages/employee/components/AddProduct';

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

const ProductMainMapge: React.FC<RandomProductsPageProps> =({
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
						categories={combinedProducts}
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
		<Route path="/" element={<ProductMainMapge 
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
				<Login />
			</PublicRoute>
		  } />
		  <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      <Route path="/account" element={
        <ProtectedRoute>
          <AccountProfile />
        </ProtectedRoute>
      } />
		{
		<Route path='/single-product-page/:id' element={<SingleOpenedProductPage 
			itemsData={combinedProducts} itemId={selectedItemId} setSelectedItemId={setSelectedItemId}/>} />
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
		</Routes>
	</Router>
  );
}

const App: React.FC = () => {
	const [selectedType, setSelectedType] = useState<string | null>(null);
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
	const [typeById, setTypeById] = useState<number | null>(null);
	const [showSingleItem, setShowSingleItem] = useState(false);
    const [searchQuery, setSearchQuery] = React.useState<string>('');
	const [loadingDelay, setLoadingDelay] = useState<string | null>(null);

	const { id } = useParams();
	const [data, setData] = useState<ProductCategory[]>();
	//const location = useLocation();
	const [loading, setLoading] = useState(false);

	useEffect(()=> {
		const loadProducts = async()=> {
			if (id) {
			setSelectedItemId(id);

			try {
				setLoading(true);

			const productsData = await combinedProducts;
			setData(productsData);
			} catch {
				console.log("id not found");
			} finally {
				setLoading(false);
			}
		} else {
			setLoading(false);
		}
		}

		loadProducts();
		
	}, [id]);

	if (loading) return(<div>Loading...</div>);



	const searchProducts =(query: string, products: ProductCategory[]): ProductCategory[] => {
		if(query.length <= 2) return [];

		const searchTerm = query.toLowerCase().trim();

		return products.map(product => {
			const categoryMatch = [product.type, product.title].some(field => 
				field.toLowerCase().includes(searchTerm)
			);

			const modelMatch = product.models.filter(model => [model.type, model.title, model.description /*, model.longDescription*/]
				.some(field => field.toLowerCase().includes(searchTerm))
			);
			return categoryMatch || modelMatch.length > 0 
			? {...product, models: categoryMatch ? product.models : modelMatch} 
			: null; 
		})
		.filter(Boolean) as ProductCategory[];
	};

      const searchResults = searchProducts(searchQuery, combinedProducts);
	  console.log(searchResults);

	  // All Contextext providers should implementted here for the following reasin:
	  // - Implementing same context providers on other components 
	  // - might result in terminating realtime effect. 
	
	return (

		<SliderProvider defaultVisible={true}>
		<div className='website-main-container'>
		  <CartlistProvider>
			<WishlistProvider>
				{/*<Navbar datas={combinedProducts} onSelectedType={setSelectedType} selectedType={selectedType}/> */}
				<TopNavbar 
					setSearchQuery={setSearchQuery}
					searchQuery={searchQuery}
					onItemId={setSelectedItemId}
					onLoading={setLoadingDelay}
					loading={loadingDelay}/>

			<SliderConditionalRenderer />
				
			{/*!selectedItemId && !selectedType &&
        <CategoryFilter datas={combinedProducts} onSelectedType={setSelectedType} selectedType={selectedType} />
      */}

	<main className='main-content-container'>
		  <AuthProvider>
			<MainPageController 
		 		category={combinedProducts}
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
					/>
					</AuthProvider>
					{/*
						<ProductsPage 
						selectedItemId={selectedItemId} 
  						setSelectedItemId={setSelectedItemId}
  						selectedType={selectedType} 	
  						setSelectedType={setSelectedType}
  						onLoading={setLoadingDelay}
  						loading={loadingDelay} /> */
					}
			<FooterComponent />
			<Footers />
	</main>
	
	</WishlistProvider> 
		</CartlistProvider>
			
		</div>
		</SliderProvider> 
	)
}

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