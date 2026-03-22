import { ProductModel } from "../types/Product";

 interface ProductsCardsProps {
    product: ProductModel;
    currency?: string;
    onItemId: (id: string) => void;
    onSelectedType: (type: string) => void;
    onLoading: (id: string | null) => void;
    loading?: string | null;   
}

export default ProductsCardsProps;