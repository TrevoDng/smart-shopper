import { Product } from "../types/Product";

 interface ProductsCardsProps {
    product: Product;
    currency?: string;
    onItemId: (id: string) => void;
    //onSelectedCategory: (category: string) => void;
    onLoading: (id: string | null) => void;
    loading?: string | null;   
}

export default ProductsCardsProps;