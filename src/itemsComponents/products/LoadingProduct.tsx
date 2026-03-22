import React from "react";

interface LoadingProductProps {
    loadingClass: string;
}

//loading product animation component
export const LoadingProduct: React.FC<LoadingProductProps> =({
    loadingClass
})=> {
    return (
        <div className={loadingClass}>
            <i className="fa fa-refresh fa-spin"></i>
        </div>
    )
} 