import React from 'react';

const SearchForm: React.FC = () => {
  // You can add state for the search input if needed
   const [searchQuery, setSearchQuery] = React.useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    if(searchQuery) {
    console.log('Form submitted', searchQuery);
    } else{
        console.log("Type something to search items")
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <form 
      className="search-form" 
      data-page-id="top-slide-design"
      onSubmit={handleSubmit}
    >
      <input 
        type="search" 
        placeholder="Search products"
         value={searchQuery}
         onChange={handleInputChange}
      />
      <button 
        type="submit" 
        className="submit-btn"
      >
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </form>
  );
};

export default SearchForm;
